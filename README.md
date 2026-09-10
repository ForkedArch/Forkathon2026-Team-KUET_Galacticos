<img src="https://i.ibb.co.com/7NrtB6Vv/image.png" />
#Forkathon 2026: [AskFlow] by [KUET_Galacticos]

 **Built for ForkedArch Freshers Hackathon 2026**
 
**👥 Team :**

| Name                     | Roll      | Department | GitHub            |
| ------------------------ | --------- | ---------- | ----------------- |
| Md. Arman Shahriar Rupom | 2K2507001 | CSE        | @Rupom2007        |
| Abhijit Adhikary         | 2K2507003 | CSE        | @abhijit-adhikary |
| Maliha Fairoz            | 2K2507089 | CSE        | @malihafairoz14   |
| Mishuk Kumar Sarker      | 2K2507018 | CSE        | @mishukdevs       |

---

## ❔ Problem
### Problem Statement :
> The Silent Classroom

The teacher asks a question.
Silence.

Not because nobody understands it—but because half the room is afraid to raise their hand. Some students don't want to look confused. Some don't want to interrupt. Others have questions that are completely different from what everyone else is thinking.

After class, suddenly everyone has questions.

And you discover that many people were confused about the exact same thing.

Maybe create a simple system that helps students ask questions and share doubts in a classroom or learning environment.

Post a question.
Browse questions from others.
Search for similar questions.
Upvote questions they also want answered.
Mark questions as answered or unresolved.

You could allow questions to be associated with a course, topic, chapter or class.

Think about how can you help students who are too shy to ask a question publicly—and how can you prevent the same question from being asked again and again?

A basic version only needs question posting, categories, search/filtering, and voting. More advanced teams could experiment with anonymous questions, teacher responses, tags, duplicate detection, or reputation systems.

### 🤔 [KUET_Galácticos]'s Understanding :
**The Main Issue:**

Students stay quiet during class because they are nervous to speak up in front of others. Teachers think the class understands the lesson when it is actually just quiet. After class, students realize that many of them had the exact same question.<br><br>
**Experience:**

As I (Rupom) am a student of CSE department. I am very introvert. We have some theoretical courses like Physics, Discrete Math, Structure Programming. Sometimes I don't understand what the teacher is teaching us but I can't ask anything to the teacher because of my shyness. For this I need to work hard later to understand the problem.
**Our Main Goal:**


Create a clean, simple tool for classes where any student can post a doubt without feeling judged, vote on other students' questions and save their valuable time.
**Basic Features:**

1. **Ask a Question:** 
Let students write and submit their doubts.
2. **Organize by Topic:** 
Group questions by class, subject, chapter, or topic.
3. **Browse and Search:** 
Help students quickly find past questions before posting a new one.
4. **Upvote System:**
Let students click "upvote" on a question if they also want to know the answer.
5. **Status Tag:** 
Show whether a question is answered or still open.

**Extra Features for Better Experience:**
1. **Anonymous Posting:** 
Allow students to hide their names so they feel completely safe asking anything.
2. **Duplicate Warning:** 
Warn users if a similar question has already been posted.
3. **Teacher Answers:** 
Give teachers an easy way to reply directly and highlight the best answers.

---
## 💡 Our Solution
### Overview
We will make a QnA environment where students can ask questions to their teachers anonymously.
### How It Works
Explain the complete flow of your system.
1.
2.
3.
---
## 🏗️ Architecture :

```text
## 🏗️ System Architecture :

AskFlow follows a modern full-stack architecture built with Next.js and Supabase.

### Architecture Overview :

- **Frontend:** Next.js (React) with Tailwind CSS
- **Backend / BaaS:** Supabase
- **Database:** PostgreSQL
- **Authentication:** Supabase Auth
- **Authorization:** PostgreSQL Row Level Security (RLS)
- **Real-time Communication:** Supabase Realtime
- **File Storage:** Supabase Storage
- **Semantic Search:** pgvector + local Transformers.js embeddings
- **API Layer:** Next.js API Routes

### Architecture Flow :

User
↓
Next.js Frontend
↓
Supabase Client / Next.js API Routes
↓
Supabase
├── PostgreSQL Database
├── Supabase Auth
├── Supabase Storage
├── Supabase Realtime
├── pgvector
└── Row Level Security

### Core Components :

#### 1. Next.js Frontend
Provides separate interfaces for:
- Students
- Teachers
- Live Class Q&A

The frontend communicates directly with Supabase for database operations, authentication, storage, and real-time updates.

#### 2. Supabase Authentication :
Supabase Auth manages user authentication.

- Students authenticate using email and password.
- Teachers use institutional credentials with teacher ID verification.
- Password recovery is handled through Supabase email recovery.

#### 3. PostgreSQL Database :
Stores application data including:
- User profiles
- Courses
- Questions
- Answers
- Votes
- Teacher academic-group assignments

#### 4. Row Level Security :
PostgreSQL RLS enforces authorization at the database level.

For example:
- Students can modify only their own questions.
- Students cannot answer questions.
- Teachers can answer questions but cannot modify question status.
- Users cannot access unauthorized academic-group data.

#### 5. Semantic Question Matching :
When a student writes a question, Transformers.js generates an embedding vector from the question content.

The vector is stored and searched using PostgreSQL's `pgvector` extension to find semantically similar solved questions.

This enables suggestions such as:

"What is a pointer in C?"
→ "Can someone explain what a pointer is?"

rather than relying on exact keyword matching.

#### 6. Suparbase Realtime :
Supabase Realtime provides live updates for:
- Live Class Q&A
- New questions
- New answers
- Vote updates

Users do not need to manually refresh the page.

#### 7. Suparbase Storage :
Attachments are stored separately from the database.

Supported attachments include:
- Images
- PDF documents
- Audio recordings

The database stores the corresponding file path and metadata.

### Data Flow :

Student Question:

Student
→ Next.js UI
→ Supabase Auth verification
→ PostgreSQL
→ Semantic similarity check
→ Similar question suggestions
→ Question published
→ Supabase Realtime
→ Other authorized users

Teacher Answer:

Teacher
→ Teacher Dashboard
→ PostgreSQL authorization via RLS
→ Answer + attachments
→ Supabase Storage
→ Answer metadata stored in PostgreSQL
→ Supabase Realtime
→ Students receive the answer

### Security Model:

AskFlow uses a defense-in-depth security model:

1. Supabase Authentication verifies user identity.
2. User profiles determine student/teacher roles.
3. PostgreSQL RLS enforces database-level permissions.
4. Storage policies control attachment access.
5. Frontend UI hides unauthorized actions, while RLS remains the actual security boundary.
```
<b>Forkathon: Freshers Hackathon 2026 presented by ForkedArch powered by XtendArena</b>
