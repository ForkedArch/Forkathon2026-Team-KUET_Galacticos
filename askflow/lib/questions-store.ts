'use client';

import { Question, Message, NotificationItem, QuestionStatus } from './types';
import { createClient } from '@/utils/supabase/client';

// Initial mock seed data so the application is immediately interactive out-of-the-box
const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q-101',
    studentId: 'student-seed-1',
    studentName: 'Alex Mercer',
    courseId: 'course-CSE1101', // Structured Programming
    body: 'What is the exact difference between pass-by-value and pass-by-reference in C functions when passing arrays vs integers?',
    attachmentUrl: null,
    attachmentType: null,
    status: 'answered',
    voteCount: 7,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'q-102',
    studentId: 'student-seed-2',
    studentName: 'Jordan Lee',
    courseId: 'course-CSE1101',
    body: 'How do memory leaks occur in C when using malloc() inside recursive function calls? Should free() be inside the base case?',
    attachmentUrl: null,
    attachmentType: null,
    status: 'unsolved',
    voteCount: 12,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'q-103',
    studentId: 'student-seed-3',
    studentName: 'Sam Rivera',
    courseId: 'course-CSE1101',
    body: 'Why does printf("%d", i++) output the old value before incrementing, but ++i outputs the incremented value immediately?',
    attachmentUrl: null,
    attachmentType: null,
    status: 'solved',
    voteCount: 4,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
  },
  {
    id: 'q-104',
    studentId: 'student-seed-4',
    studentName: 'Taylor Morgan',
    courseId: 'course-CSE4109', // Machine Learning
    body: 'In gradient descent, how do we determine the optimal learning rate alpha without causing overshooting or extremely slow convergence?',
    attachmentUrl: null,
    attachmentType: null,
    status: 'unsolved',
    voteCount: 15,
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm-1',
    questionId: 'q-101',
    senderType: 'student',
    senderId: 'student-seed-1',
    body: 'What is the exact difference between pass-by-value and pass-by-reference in C functions when passing arrays vs integers?',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'm-2',
    questionId: 'q-101',
    senderType: 'teacher',
    senderId: 'cse-1101-0',
    body: 'In C, integers are passed by value (a copy is sent). Arrays decay into pointers to their first element, so passing an array effectively passes a reference to memory! Changes inside the function will modify the original array.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'm-3',
    questionId: 'q-103',
    senderType: 'student',
    senderId: 'student-seed-3',
    body: 'Why does printf("%d", i++) output the old value before incrementing, but ++i outputs the incremented value immediately?',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'm-4',
    questionId: 'q-103',
    senderType: 'teacher',
    senderId: 'cse-1101-0',
    body: 'i++ is the post-increment operator: it evaluates to the current value of i first, then increments i. ++i is pre-increment: it increments i first, then evaluates to the new value.',
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    recipientType: 'student',
    recipientId: 'student-seed-1',
    questionId: 'q-101',
    message: 'Instructor replied to your question regarding array passing in C.',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

export class QuestionsStore {
  private static getStoredQuestions(): Question[] {
    if (typeof window === 'undefined') return INITIAL_QUESTIONS;
    const data = localStorage.getItem('askflow_questions');
    if (!data) {
      localStorage.setItem('askflow_questions', JSON.stringify(INITIAL_QUESTIONS));
      return INITIAL_QUESTIONS;
    }
    return JSON.parse(data);
  }

  private static saveQuestions(questions: Question[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('askflow_questions', JSON.stringify(questions));
    }
  }

  private static getStoredMessages(): Message[] {
    if (typeof window === 'undefined') return INITIAL_MESSAGES;
    const data = localStorage.getItem('askflow_messages');
    if (!data) {
      localStorage.setItem('askflow_messages', JSON.stringify(INITIAL_MESSAGES));
      return INITIAL_MESSAGES;
    }
    return JSON.parse(data);
  }

  private static saveMessages(messages: Message[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('askflow_messages', JSON.stringify(messages));
    }
  }

  private static getStoredVotes(): Record<string, string[]> {
    if (typeof window === 'undefined') return {};
    const data = localStorage.getItem('askflow_user_votes');
    return data ? JSON.parse(data) : {};
  }

  private static saveVotes(votes: Record<string, string[]>) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('askflow_user_votes', JSON.stringify(votes));
    }
  }

  public static getStoredNotifications(): NotificationItem[] {
    if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
    const data = localStorage.getItem('askflow_notifications');
    if (!data) {
      localStorage.setItem('askflow_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(data);
  }

  public static saveNotifications(notifs: NotificationItem[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('askflow_notifications', JSON.stringify(notifs));
    }
  }

  // Get questions for a course & filter type
  public static getQuestions(
    courseCode: string,
    filter: 'ask' | 'unsolved' | 'top' | 'solved',
    studentId?: string
  ): Question[] {
    const questions = this.getStoredQuestions();
    const userVotes = this.getStoredVotes();
    const courseQuestions = questions.filter((q) =>
      q.courseId === `course-${courseCode}` || q.courseId.includes(courseCode)
    );

    // Attach vote state for this student
    const withVotes = courseQuestions.map((q) => ({
      ...q,
      hasVoted: studentId ? (userVotes[studentId] || []).includes(q.id) : false,
    }));

    if (filter === 'unsolved') {
      // PRD: Unsolved filter = status is unsolved OR answered awaiting confirmation
      return withVotes
        .filter((q) => q.status === 'unsolved' || q.status === 'answered')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    if (filter === 'top') {
      return withVotes.sort((a, b) => b.voteCount - a.voteCount);
    }

    if (filter === 'solved') {
      return withVotes
        .filter((q) => q.status === 'solved')
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }

    // Default 'ask' or recent
    return withVotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Search questions in course for duplicate detection
  public static searchQuestions(courseCode: string, query: string): Question[] {
    if (!query.trim()) return [];
    const questions = this.getStoredQuestions();
    const qLower = query.toLowerCase().trim();
    const terms = qLower.split(/\s+/);

    return questions
      .filter((q) => q.courseId === `course-${courseCode}` || q.courseId.includes(courseCode))
      .filter((q) => {
        const bodyLower = q.body.toLowerCase();
        return terms.some((term) => bodyLower.includes(term));
      })
      .slice(0, 5);
  }

  // Vote / Unvote
  public static toggleVote(questionId: string, studentId: string): { voteCount: number; hasVoted: boolean } {
    const questions = this.getStoredQuestions();
    const userVotes = this.getStoredVotes();
    const studentVotes = userVotes[studentId] || [];

    const hasVoted = studentVotes.includes(questionId);
    let newVoteCount = 0;

    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        newVoteCount = hasVoted ? Math.max(0, q.voteCount - 1) : q.voteCount + 1;
        return { ...q, voteCount: newVoteCount };
      }
      return q;
    });

    if (hasVoted) {
      userVotes[studentId] = studentVotes.filter((id) => id !== questionId);
    } else {
      userVotes[studentId] = [...studentVotes, questionId];
    }

    this.saveQuestions(updatedQuestions);
    this.saveVotes(userVotes);

    return { voteCount: newVoteCount, hasVoted: !hasVoted };
  }

  // Ask new question
  public static addQuestion(data: {
    studentId: string;
    studentName: string;
    courseCode: string;
    body: string;
    attachmentUrl?: string | null;
    attachmentType?: 'image' | 'audio' | 'pdf' | null;
  }): Question {
    const questions = this.getStoredQuestions();
    const messages = this.getStoredMessages();

    const newQ: Question = {
      id: 'q-' + Date.now(),
      studentId: data.studentId,
      studentName: data.studentName,
      courseId: `course-${data.courseCode}`,
      body: data.body,
      attachmentUrl: data.attachmentUrl || null,
      attachmentType: data.attachmentType || null,
      status: 'unsolved',
      voteCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const firstMsg: Message = {
      id: 'm-' + Date.now(),
      questionId: newQ.id,
      senderType: 'student',
      senderId: data.studentId,
      body: data.body,
      attachmentUrl: data.attachmentUrl || null,
      attachmentType: data.attachmentType || null,
      createdAt: newQ.createdAt,
    };

    this.saveQuestions([newQ, ...questions]);
    this.saveMessages([...messages, firstMsg]);

    return newQ;
  }

  // Get full thread messages
  public static getThread(questionId: string): Message[] {
    const messages = this.getStoredMessages();
    return messages
      .filter((m) => m.questionId === questionId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  // Post follow-up or reply
  public static postMessage(data: {
    questionId: string;
    senderType: 'student' | 'teacher';
    senderId: string;
    body?: string | null;
    attachmentUrl?: string | null;
    attachmentType?: 'image' | 'audio' | 'pdf' | null;
  }): Message {
    const messages = this.getStoredMessages();
    const questions = this.getStoredQuestions();

    const newMsg: Message = {
      id: 'm-' + Date.now(),
      questionId: data.questionId,
      senderType: data.senderType,
      senderId: data.senderId,
      body: data.body,
      attachmentUrl: data.attachmentUrl || null,
      attachmentType: data.attachmentType || null,
      createdAt: new Date().toISOString(),
    };

    // If teacher replies, flip status to answered and create notification
    if (data.senderType === 'teacher') {
      const qIndex = questions.findIndex((q) => q.id === data.questionId);
      if (qIndex !== -1) {
        questions[qIndex].status = 'answered';
        questions[qIndex].updatedAt = new Date().toISOString();
        this.saveQuestions(questions);

        // Notify student
        const notifs = this.getStoredNotifications();
        const newNotif: NotificationItem = {
          id: 'notif-' + Date.now(),
          recipientType: 'student',
          recipientId: questions[qIndex].studentId,
          questionId: data.questionId,
          message: `Your instructor replied to question: "${questions[qIndex].body.slice(0, 30)}..."`,
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        this.saveNotifications([newNotif, ...notifs]);
      }
    }

    this.saveMessages([...messages, newMsg]);
    return newMsg;
  }

  // Mark solved by student
  public static markSolved(questionId: string, studentId: string): boolean {
    const questions = this.getStoredQuestions();
    const qIndex = questions.findIndex((q) => q.id === questionId && q.studentId === studentId);

    if (qIndex !== -1) {
      questions[qIndex].status = 'solved';
      questions[qIndex].updatedAt = new Date().toISOString();
      this.saveQuestions(questions);
      return true;
    }
    return false;
  }

  // Get student's own history
  public static getStudentHistory(studentId: string): Question[] {
    const questions = this.getStoredQuestions();
    return questions
      .filter((q) => q.studentId === studentId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
