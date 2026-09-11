'use client';

import React from 'react';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { LandingView } from '@/components/auth/landing-view';
import { StudentDashboard } from '@/components/dashboard/student-dashboard';
import { TeacherDashboard } from '@/components/dashboard/teacher-dashboard';
import { Loader2 } from 'lucide-react';

function MainRouter() {
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7f9f8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
      </div>
    );
  }

  if (role === 'student') {
    return <StudentDashboard />;
  }

  if (role === 'teacher') {
    return <TeacherDashboard />;
  }

  return <LandingView />;
}

export default function Page() {
  return (
    <AuthProvider>
      <MainRouter />
    </AuthProvider>
  );
}
