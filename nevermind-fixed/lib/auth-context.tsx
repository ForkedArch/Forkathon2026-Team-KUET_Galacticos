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

  // Initialize session from Supabase
  useEffect(() => {
    async function initSession() {
      const clearAuthState = () => {
        setRole(null);
        setStudent(null);
        setTeacher(null);
        localStorage.removeItem('askflow_role');
        localStorage.removeItem('askflow_student');
        localStorage.removeItem('askflow_teacher');
      };

      try {
        const supabase = createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          clearAuthState();
          return;
        }

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
          setTeacher(null);
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
            setStudent(null);
            localStorage.setItem('askflow_role', 'teacher');
            localStorage.setItem('askflow_teacher', JSON.stringify(profile));
          } else {
            clearAuthState();
          }
        }
      } catch (err) {
        clearAuthState();
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
      if (!data.email || !data.password) {
        return { error: 'Email and password are required.' };
      }

      const supabase = createClient();
      let userId: string;

      if (data.isSignUp) {
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });

        if (authErr) {
          return { error: authErr.message };
        }

        if (!authData?.user) {
          return { error: 'Sign up failed. Could not create user.' };
        }

        userId = authData.user.id;

        // Ensure active session after signup
        if (!authData.session) {
          await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
          });
        }

        // Insert profile into DB
        const { error: insertError } = await supabase.from('students').insert({
          id: userId,
          name: data.name,
          roll_number: data.rollNumber,
          email: data.email,
          year: data.year,
          term: data.term,
        });

        if (insertError) {
          return { error: 'Failed to create student profile: ' + insertError.message };
        }
      } else {
        const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (authErr) {
          return { error: authErr.message };
        }

        if (!authData?.user) {
          return { error: 'Sign in failed.' };
        }

        userId = authData.user.id;
      }

      const { data: studentData } = await supabase
        .from('students')
        .select('*')
        .eq('id', userId)
        .single();

      if (!data.isSignUp && !studentData) {
        return { error: 'No student account found for this email. Please sign up first.' };
      }

      const profile: StudentProfile = studentData
        ? {
            id: studentData.id,
            name: studentData.name,
            rollNumber: studentData.roll_number,
            email: studentData.email,
            year: studentData.year,
            term: studentData.term,
          }
        : {
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

      if (!data.email || !data.password) {
        return { error: 'Email and password are required.' };
      }

      const supabase = createClient();
      let userId: string;

      if (data.isSignUp) {
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });

        if (authErr) {
          return { error: authErr.message };
        }

        if (!authData?.user) {
          return { error: 'Sign up failed. Could not create user.' };
        }

        userId = authData.user.id;

        // Ensure active session after signup
        if (!authData.session) {
          await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
          });
        }

        // Fetch course ID from courses table
        const { data: courseRow } = await supabase
          .from('courses')
          .select('id')
          .eq('course_code', courseInfo.code)
          .single();

        if (courseRow) {
          const { error: insertError } = await supabase.from('teachers').insert({
            id: userId,
            name: data.name,
            email: data.email,
            teacher_id: data.teacherId,
            course_id: courseRow.id,
          });

          if (insertError) {
            return { error: 'Failed to create teacher profile: ' + insertError.message };
          }
        } else {
          return { error: 'Course not found for this teacher ID.' };
        }
      } else {
        const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (authErr) {
          return { error: authErr.message };
        }

        if (!authData?.user) {
          return { error: 'Sign in failed.' };
        }

        userId = authData.user.id;
      }

      const { data: teacherData } = await supabase
        .from('teachers')
        .select('*, courses(*)')
        .eq('id', userId)
        .single();

      if (!data.isSignUp && !teacherData) {
        return { error: 'No teacher account found for this email. Please sign up first.' };
      }

      let profile: TeacherProfile;
      if (teacherData) {
        const course = teacherData.courses;
        profile = {
          id: teacherData.id,
          name: teacherData.name,
          email: teacherData.email,
          teacherId: teacherData.teacher_id,
          courseId: teacherData.course_id,
          courseCode: course?.course_code || courseInfo.code,
          courseName: course?.course_name || courseInfo.name,
        };
      } else {
        profile = {
          id: userId,
          name: data.name,
          email: data.email,
          teacherId: data.teacherId,
          courseId: 'course-' + courseInfo.code,
          courseCode: courseInfo.code,
          courseName: courseInfo.name,
        };
      }

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
