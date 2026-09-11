export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      courses: {
        Row: {
          id: string;
          course_code: string;
          course_name: string;
          year: number;
          term: number;
          teacher_id: string;
        };
        Insert: {
          id?: string;
          course_code: string;
          course_name: string;
          year: number;
          term: number;
          teacher_id: string;
        };
        Update: {
          id?: string;
          course_code?: string;
          course_name?: string;
          year?: number;
          term?: number;
          teacher_id?: string;
        };
        Relationships: [];
      };
      teachers: {
        Row: {
          id: string;
          name: string;
          email: string;
          teacher_id: string;
          course_id: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          teacher_id: string;
          course_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          teacher_id?: string;
          course_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'teachers_course_id_fkey';
            columns: ['course_id'];
            isOneToOne: true;
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          }
        ];
      };
      students: {
        Row: {
          id: string;
          name: string;
          roll_number: string;
          email: string;
          year: number;
          term: number;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          roll_number: string;
          email: string;
          year: number;
          term: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          roll_number?: string;
          email?: string;
          year?: number;
          term?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      questions: {
        Row: {
          id: string;
          student_id: string;
          course_id: string;
          body: string;
          attachment_url: string | null;
          attachment_type: 'image' | 'audio' | 'pdf' | null;
          status: 'unsolved' | 'answered' | 'solved';
          vote_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          course_id: string;
          body: string;
          attachment_url?: string | null;
          attachment_type?: 'image' | 'audio' | 'pdf' | null;
          status?: 'unsolved' | 'answered' | 'solved';
          vote_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          course_id?: string;
          body?: string;
          attachment_url?: string | null;
          attachment_type?: 'image' | 'audio' | 'pdf' | null;
          status?: 'unsolved' | 'answered' | 'solved';
          vote_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'questions_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'students';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'questions_course_id_fkey';
            columns: ['course_id'];
            isOneToOne: false;
            referencedRelation: 'courses';
            referencedColumns: ['id'];
          }
        ];
      };
      messages: {
        Row: {
          id: string;
          question_id: string;
          sender_type: 'student' | 'teacher';
          sender_id: string;
          body: string | null;
          attachment_url: string | null;
          attachment_type: 'image' | 'audio' | 'pdf' | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          question_id: string;
          sender_type: 'student' | 'teacher';
          sender_id: string;
          body?: string | null;
          attachment_url?: string | null;
          attachment_type?: 'image' | 'audio' | 'pdf' | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          question_id?: string;
          sender_type?: 'student' | 'teacher';
          sender_id?: string;
          body?: string | null;
          attachment_url?: string | null;
          attachment_type?: 'image' | 'audio' | 'pdf' | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'messages_question_id_fkey';
            columns: ['question_id'];
            isOneToOne: false;
            referencedRelation: 'questions';
            referencedColumns: ['id'];
          }
        ];
      };
      votes: {
        Row: {
          id: string;
          question_id: string;
          student_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          question_id: string;
          student_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          question_id?: string;
          student_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'votes_question_id_fkey';
            columns: ['question_id'];
            isOneToOne: false;
            referencedRelation: 'questions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'votes_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'students';
            referencedColumns: ['id'];
          }
        ];
      };
      notifications: {
        Row: {
          id: string;
          recipient_type: 'student' | 'teacher';
          recipient_id: string;
          question_id: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipient_type: 'student' | 'teacher';
          recipient_id: string;
          question_id: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          recipient_type?: 'student' | 'teacher';
          recipient_id?: string;
          question_id?: string;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_question_id_fkey';
            columns: ['question_id'];
            isOneToOne: false;
            referencedRelation: 'questions';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {};
    Functions: {
      create_question: {
        Args: {
          p_course_id: string;
          p_body: string;
          p_attachment_url?: string | null;
          p_attachment_type?: string | null;
        };
        Returns: string;
      };
      post_teacher_reply: {
        Args: {
          p_question_id: string;
          p_body: string;
          p_attachment_url?: string | null;
          p_attachment_type?: string | null;
        };
        Returns: undefined;
      };
      post_student_followup: {
        Args: {
          p_question_id: string;
          p_body: string;
          p_attachment_url?: string | null;
          p_attachment_type?: string | null;
        };
        Returns: undefined;
      };
      mark_question_solved: {
        Args: { p_question_id: string };
        Returns: undefined;
      };
      cast_vote: {
        Args: { p_question_id: string };
        Returns: undefined;
      };
      remove_vote: {
        Args: { p_question_id: string };
        Returns: undefined;
      };
      search_questions: {
        Args: { p_course_id: string; p_query: string };
        Returns: Database['public']['Tables']['questions']['Row'][];
      };
      get_question_thread: {
        Args: { p_question_id: string };
        Returns: {
          message_id: string;
          sender_type: string;
          sender_id: string;
          sender_name: string | null;
          body: string | null;
          attachment_url: string | null;
          attachment_type: string | null;
          created_at: string;
        }[];
      };
    };
    Enums: {
      question_status: 'unsolved' | 'answered' | 'solved';
    };
    CompositeTypes: {};
  };
};
