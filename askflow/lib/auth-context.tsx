'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { StudentProfile, TeacherProfile, Role } from './types';
import { COURSE_CATALOG } from './constants';

interface AuthContextType {
  role: Role | null;
  student: StudentProfile | null;
  teacher: TeacherProfile | null;
  isLoading: boolean;
  loginStudent: (data: {
    name: string;
    rollNumber: string;
    email: string;
    password?: string;
    year: number;
    term: number;
    isSignUp?: boolean;
  }) => Promise<{ error?: string }>;
  loginTeacher: (data: {
    name: string;
    email: string;
    teacherId: string;
    password?: string;
    courseCode: string;
    isSignUp?: boolean;
  }) => Promise<{ error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session from localStorage or Supabase
  useEffect(() => {
    async function initSession() {
      try {
        const storedRole = localStorage.getItem('askflow_role') as Role | null;
        const storedStudent = localStorage.getItem('askflow_student');
        const storedTeacher = localStorage.getItem('askflow_teacher');

        if (storedRole === 'student' && storedStudent) {
          setRole('student');
          setStudent(JSON.parse(storedStudent));
        } else if (storedRole === 'teacher' && storedTeacher) {
          setRole('teacher');
          setTeacher(JSON.parse(storedTeacher));
        }

        // Check Supabase user if connected
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // Check student table
          const { data: studentData } = await supabase
            .from('students')
            .select('*')
            .eq('id', user.id)
            .single();

          if (studentData) {
            const profile: StudentProfile = {
              id: studentData.id,
              name: studentData.name,
              rollNumber: studentData.roll_number,
              email: studentData.email,
              year: studentData.year,
              term: studentData.term,
            };
            setRole('student');
            setStudent(profile);
            localStorage.setItem('askflow_role', 'student');
            localStorage.setItem('askflow_student', JSON.stringify(profile));
          } else {
            // Check teacher table
            const { data: teacherData } = await supabase
              .from('teachers')
              .select('*, courses(*)')
              .eq('id', user.id)
              .single();

            if (teacherData) {
              const course = teacherData.courses;
              const profile: TeacherProfile = {
                id: teacherData.id,
                name: teacherData.name,
                email: teacherData.email,
                teacherId: teacherData.teacher_id,
                courseId: teacherData.course_id,
                courseCode: course?.course_code || 'CSE1101',
                courseName: course?.course_name || 'Structured Programming',
              };
              setRole('teacher');
              setTeacher(profile);
              localStorage.setItem('askflow_role', 'teacher');
              localStorage.setItem('askflow_teacher', JSON.stringify(profile));
            }
          }
        }
      } catch (err) {
        console.warn('Auth init check (continuing with local state):', err);
      } finally {
        setIsLoading(false);
      }
    }

    initSession();
  }, []);

  const loginStudent = async (data: {
    name: string;
    rollNumber: string;
    email: string;
    password?: string;
    year: number;
    term: number;
    isSignUp?: boolean;
  }): Promise<{ error?: string }> => {
    try {
      const supabase = createClient();
      let userId = 'student-' + Date.now();

      // Attempt Supabase Auth if password provided
      if (data.password && data.email) {
        if (data.isSignUp) {
          const { data: authData, error: authErr } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
          });

          if (authErr && !authErr.message.includes('FetchError') && !authErr.message.includes('dummy')) {
            return { error: authErr.message };
          }

          if (authData?.user) {
            userId = authData.user.id;
            // Insert profile into DB
            await supabase.from('students').insert({
              id: userId,
              name: data.name,
              roll_number: data.rollNumber,
              email: data.email,
              year: data.year,
              term: data.term,
            });
          }
        } else {
          const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
          });

          if (authErr && !authErr.message.includes('FetchError') && !authErr.message.includes('dummy')) {
            // If sign in failed, try local account or return error
            if (data.isSignUp === false) {
              return { error: 'Account not found or password invalid. Please sign up.' };
            }
          }

          if (authData?.user) {
            userId = authData.user.id;
          }
        }
      }

      const profile: StudentProfile = {
        id: userId,
        name: data.name,
        rollNumber: data.rollNumber,
        email: data.email,
        year: Number(data.year),
        term: Number(data.term),
      };

      setRole('student');
      setStudent(profile);
      setTeacher(null);

      localStorage.setItem('askflow_role', 'student');
      localStorage.setItem('askflow_student', JSON.stringify(profile));
      localStorage.removeItem('askflow_teacher');

      return {};
    } catch (err: any) {
      return { error: err.message || 'Failed to authenticate student' };
    }
  };

  const loginTeacher = async (data: {
    name: string;
    email: string;
    teacherId: string;
    password?: string;
    courseCode: string;
    isSignUp?: boolean;
  }): Promise<{ error?: string }> => {
    try {
      // 1. Validation: Teacher ID MUST exist in pre-seeded catalog
      const courseInfo = COURSE_CATALOG.find(
        (c) => c.teacherId.toLowerCase() === data.teacherId.trim().toLowerCase()
      );

      if (!courseInfo) {
        return { error: 'Invalid teacher ID.' };
      }

      const supabase = createClient();
      let userId = 'teacher-' + Date.now();

      if (data.password && data.email) {
        if (data.isSignUp) {
          const { data: authData, error: authErr } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
          });

          if (authErr && !authErr.message.includes('FetchError') && !authErr.message.includes('dummy')) {
            return { error: authErr.message };
          }

          if (authData?.user) {
            userId = authData.user.id;

            // Fetch course ID from courses table if Supabase is connected
            const { data: courseRow } = await supabase
              .from('courses')
              .select('id')
              .eq('course_code', courseInfo.code)
              .single();

            if (courseRow) {
              await supabase.from('teachers').insert({
                id: userId,
                name: data.name,
                email: data.email,
                teacher_id: data.teacherId,
                course_id: courseRow.id,
              });
            }
          }
        } else {
          const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
          });

          if (authErr && !authErr.message.includes('FetchError') && !authErr.message.includes('dummy')) {
            if (data.isSignUp === false) {
              return { error: 'Account not found or password invalid. Please sign up.' };
            }
          }

          if (authData?.user) {
            userId = authData.user.id;
          }
        }
      }

      const profile: TeacherProfile = {
        id: userId,
        name: data.name,
        email: data.email,
        teacherId: data.teacherId,
        courseId: 'course-' + courseInfo.code,
        courseCode: courseInfo.code,
        courseName: courseInfo.name,
      };

      setRole('teacher');
      setTeacher(profile);
      setStudent(null);

      localStorage.setItem('askflow_role', 'teacher');
      localStorage.setItem('askflow_teacher', JSON.stringify(profile));
      localStorage.removeItem('askflow_student');

      return {};
    } catch (err: any) {
      return { error: err.message || 'Failed to authenticate teacher' };
    }
  };

  const logout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Sign out error:', err);
    }
    setRole(null);
    setStudent(null);
    setTeacher(null);
    localStorage.removeItem('askflow_role');
    localStorage.removeItem('askflow_student');
    localStorage.removeItem('askflow_teacher');
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        student,
        teacher,
        isLoading,
        loginStudent,
        loginTeacher,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
