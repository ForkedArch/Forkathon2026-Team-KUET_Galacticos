export type Role = 'student' | 'teacher';

export interface StudentProfile {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  year: number;
  term: number;
}

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  teacherId: string;
  courseId: string;
  courseCode: string;
  courseName: string;
}

export interface Course {
  id: string;
  courseCode: string;
  courseName: string;
  year: number;
  term: number;
  teacherId: string;
}

export type QuestionStatus = 'unsolved' | 'answered' | 'solved';

export interface Question {
  id: string;
  studentId: string;
  studentName?: string; // Only visible to teacher in thread view
  courseId: string;
  body: string;
  attachmentUrl?: string | null;
  attachmentType?: 'image' | 'audio' | 'pdf' | null;
  status: QuestionStatus;
  voteCount: number;
  hasVoted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  questionId: string;
  senderType: 'student' | 'teacher';
  senderId: string;
  body?: string | null;
  attachmentUrl?: string | null;
  attachmentType?: 'image' | 'audio' | 'pdf' | null;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  recipientType: 'student' | 'teacher';
  recipientId: string;
  questionId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
