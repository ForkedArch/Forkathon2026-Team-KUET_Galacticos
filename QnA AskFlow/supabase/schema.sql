-- Enable necessary extensions for UUIDs and Fuzzy Search
create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- 1. Enums & Tables
create type question_status as enum ('unsolved', 'answered', 'solved');

create table courses (
  id uuid primary key default gen_random_uuid(),
  course_code text unique not null,
  course_name text not null,
  year int not null check (year between 1 and 4),
  term int not null check (term between 1 and 2),
  teacher_id text unique not null
);

create table teachers (
  id uuid primary key references auth.users(id),
  name text not null,
  email text not null unique,
  teacher_id text not null unique references courses(teacher_id),
  course_id uuid not null unique references courses(id),
  created_at timestamptz default now()
);

create table students (
  id uuid primary key references auth.users(id),
  name text not null,
  roll_number text not null,
  email text not null unique,
  year int not null check (year between 1 and 4),
  term int not null check (term between 1 and 2),
  created_at timestamptz default now()
);

create table questions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id),
  course_id uuid not null references courses(id),
  body text not null,
  attachment_url text,
  attachment_type text check (attachment_type in ('image','audio','pdf')),
  status question_status not null default 'unsolved',
  vote_count int not null default 0,
  search_vector tsvector generated always as (to_tsvector('english', body)) stored,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for blazing fast FTS & Trigram similarity
create index questions_trgm_idx on questions using gin (body gin_trgm_ops);
create index questions_fts_idx on questions using gin (search_vector);

create table messages (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions(id) on delete cascade,
  sender_type text not null check (sender_type in ('student','teacher')),
  sender_id uuid not null,
  body text,
  attachment_url text,
  attachment_type text check (attachment_type in ('image','audio','pdf')),
  created_at timestamptz default now()
);

create table votes (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions(id) on delete cascade,
  student_id uuid not null references students(id),
  created_at timestamptz default now(),
  unique (question_id, student_id)
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_type text not null check (recipient_type in ('student','teacher')),
  recipient_id uuid not null,
  question_id uuid not null references questions(id) on delete cascade,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz default now()
);

-- 2. Triggers for sync
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_questions_updated_at
before update on questions
for each row execute function update_updated_at_column();

create or replace function sync_vote_count()
returns trigger as $$
begin
  if (tg_op = 'INSERT') then
    update questions set vote_count = vote_count + 1 where id = new.question_id;
  elsif (tg_op = 'DELETE') then
    update questions set vote_count = vote_count - 1 where id = old.question_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger trigger_sync_vote_count
after insert or delete on votes
for each row execute function sync_vote_count();

-- 3. Row Level Security (RLS)
alter table courses enable row level security;
alter table teachers enable row level security;
alter table students enable row level security;
alter table questions enable row level security;
alter table messages enable row level security;
alter table votes enable row level security;
alter table notifications enable row level security;

create policy "Courses are readable by all authenticated users" 
on courses for select to authenticated using (true);

create policy "Teachers can read own profile" 
on teachers for select to authenticated using (auth.uid() = id);

create policy "Teachers can insert own profile" 
on teachers for insert to authenticated with check (auth.uid() = id);

create policy "Students can read own profile" 
on students for select to authenticated using (auth.uid() = id);

create policy "Students can insert own profile" 
on students for insert to authenticated with check (auth.uid() = id);

-- Q: Students see their Year/Term. Teachers see their Course.
create policy "Students view questions for their year/term" 
on questions for select to authenticated 
using (
  exists (
    select 1 from students s
    join courses c on c.id = questions.course_id
    where s.id = auth.uid() and s.year = c.year and s.term = c.term
  )
);

create policy "Teachers view questions for their assigned course" 
on questions for select to authenticated 
using (
  exists (
    select 1 from teachers t
    where t.id = auth.uid() and t.course_id = questions.course_id
  )
);

create policy "Users can view relevant messages" 
on messages for select to authenticated 
using (
  exists (
    select 1 from questions q
    left join students s on s.id = q.student_id
    left join teachers t on t.course_id = q.course_id
    where q.id = messages.question_id 
    and (s.id = auth.uid() or t.id = auth.uid())
  )
);

create policy "Students can view votes" 
on votes for select to authenticated using (true);

create policy "Users view own notifications" 
on notifications for select to authenticated using (recipient_id = auth.uid());

create policy "Users update own notifications" 
on notifications for update to authenticated using (recipient_id = auth.uid());


-- 4. Server-Side Security Definer RPCs (PRD Mandate 14)

create or replace function create_question(
  p_course_id uuid, p_body text, p_attachment_url text default null, p_attachment_type text default null
) returns uuid as $$
declare
  v_question_id uuid;
begin
  insert into questions (student_id, course_id, body, attachment_url, attachment_type)
  values (auth.uid(), p_course_id, p_body, p_attachment_url, p_attachment_type)
  returning id into v_question_id;

  insert into messages (question_id, sender_type, sender_id, body, attachment_url, attachment_type)
  values (v_question_id, 'student', auth.uid(), p_body, p_attachment_url, p_attachment_type);
  
  return v_question_id;
end;
$$ language plpgsql security definer;

create or replace function post_teacher_reply(
  p_question_id uuid, p_body text, p_attachment_url text default null, p_attachment_type text default null
) returns void as $$
declare
  v_student_id uuid;
  v_body_snippet text;
begin
  if not exists (
    select 1 from questions q join teachers t on t.course_id = q.course_id
    where q.id = p_question_id and t.id = auth.uid()
  ) then raise exception 'Unauthorized'; end if;

  insert into messages (question_id, sender_type, sender_id, body, attachment_url, attachment_type)
  values (p_question_id, 'teacher', auth.uid(), p_body, p_attachment_url, p_attachment_type);

  update questions set status = 'answered' where id = p_question_id;

  select student_id, substring(body from 1 for 30) into v_student_id, v_body_snippet 
  from questions where id = p_question_id;

  insert into notifications (recipient_type, recipient_id, question_id, message)
  values ('student', v_student_id, p_question_id, 'Instructor replied: "' || v_body_snippet || '..."');
end;
$$ language plpgsql security definer;

create or replace function post_student_followup(
  p_question_id uuid, p_body text, p_attachment_url text default null, p_attachment_type text default null
) returns void as $$
begin
  if not exists (select 1 from questions where id = p_question_id and student_id = auth.uid()) then
    raise exception 'Unauthorized';
  end if;

  insert into messages (question_id, sender_type, sender_id, body, attachment_url, attachment_type)
  values (p_question_id, 'student', auth.uid(), p_body, p_attachment_url, p_attachment_type);
end;
$$ language plpgsql security definer;

create or replace function mark_question_solved(p_question_id uuid) returns void as $$
begin
  update questions set status = 'solved' where id = p_question_id and student_id = auth.uid();
end;
$$ language plpgsql security definer;

create or replace function cast_vote(p_question_id uuid) returns void as $$
begin
  insert into votes (question_id, student_id) values (p_question_id, auth.uid()) on conflict do nothing;
end;
$$ language plpgsql security definer;

create or replace function remove_vote(p_question_id uuid) returns void as $$
begin
  delete from votes where question_id = p_question_id and student_id = auth.uid();
end;
$$ language plpgsql security definer;

create or replace function search_questions(p_course_id uuid, p_query text)
returns setof questions as $$
begin
  return query select * from questions where course_id = p_course_id
  and (search_vector @@ plainto_tsquery('english', p_query) or body % p_query)
  order by ts_rank(search_vector, plainto_tsquery('english', p_query)) + similarity(body, p_query) desc limit 10;
end;
$$ language plpgsql security definer;

create or replace function get_question_thread(p_question_id uuid)
returns table (
  message_id uuid, sender_type text, sender_id uuid, sender_name text,
  body text, attachment_url text, attachment_type text, created_at timestamptz
) as $$
declare
  v_is_teacher boolean;
begin
  select exists (
    select 1 from questions q join teachers t on t.course_id = q.course_id
    where q.id = p_question_id and t.id = auth.uid()
  ) into v_is_teacher;

  return query
  select m.id, m.sender_type, m.sender_id,
    case 
      when m.sender_type = 'teacher' then t.name
      when m.sender_type = 'student' and (v_is_teacher or m.sender_id = auth.uid()) then s.name
      else null
    end as sender_name,
    m.body, m.attachment_url, m.attachment_type, m.created_at
  from messages m
  left join students s on s.id = m.sender_id and m.sender_type = 'student'
  left join teachers t on t.id = m.sender_id and m.sender_type = 'teacher'
  where m.question_id = p_question_id order by m.created_at asc;
end;
$$ language plpgsql security definer;
