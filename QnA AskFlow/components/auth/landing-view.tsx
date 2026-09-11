'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OvalButton } from '@/components/ui/oval-button';
import { GraduationCap, BookOpen, ShieldCheck, ArrowRight, HelpCircle } from 'lucide-react';
import { StudentAuthForm } from './student-auth-form';
import { TeacherAuthForm } from './teacher-auth-form';

type SplashStep = 'welcome' | 'anonymous' | 'role_picker' | 'student_login' | 'teacher_login';

export function LandingView() {
  const [step, setStep] = useState<SplashStep>('welcome');

  return (
    <div className="min-h-screen bg-[#f7f9f8] flex flex-col justify-between p-6 md:p-12 relative overflow-hidden font-sans">
      {/* Background Subtle Shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#e2ece9] rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#e8eee9] rounded-full blur-3xl opacity-60 pointer-events-none" />

      {/* Header Logo */}
      <header className="flex items-center justify-between w-full max-w-6xl mx-auto z-10">
        <div 
          onClick={() => setStep('welcome')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <HelpCircle className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[var(--color-foreground)]">
            AskFlow
          </span>
        </div>
        {step !== 'welcome' && (
          <button
            onClick={() => setStep('welcome')}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            ← Back to Start
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center py-12 z-10 max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {step === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-8 max-w-lg mx-auto"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#e8efe8] text-[var(--color-primary)] text-xs font-semibold tracking-wide">
                <BookOpen className="w-4 h-4" />
                <span>Classroom Q&A Platform</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Welcome to <span className="text-[var(--color-primary)]">AskFlow</span>
                </h1>
                <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                  Clear your academic doubts effortlessly. Connect directly with your course instructor without the anxiety.
                </p>
              </div>

              <div className="pt-4">
                <OvalButton
                  onClick={() => setStep('anonymous')}
                  className="w-full sm:w-auto px-10 py-4 text-base shadow-md group"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </OvalButton>
              </div>
            </motion.div>
          )}

          {step === 'anonymous' && (
            <motion.div
              key="anonymous"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-8 max-w-lg mx-auto"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-[#e2ece9] text-[var(--color-primary)] flex items-center justify-center shadow-inner">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Fearless Learning
                </h2>
                <p className="text-slate-600 text-base leading-relaxed">
                  Feel free to share your doubts anonymously. Peer students will never see your name, eliminating the fear of asking "dumb" questions.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center">
                <OvalButton
                  onClick={() => setStep('role_picker')}
                  className="px-10 py-3.5 text-base shadow-sm"
                >
                  Continue
                </OvalButton>
              </div>
            </motion.div>
          )}

          {step === 'role_picker' && (
            <motion.div
              key="role_picker"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-8 max-w-md mx-auto w-full"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Choose Your Role
                </h2>
                <p className="text-slate-600 text-sm">
                  Select your role to access your personalized classroom portal
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <OvalButton
                  variant="primary"
                  onClick={() => setStep('student_login')}
                  className="w-full py-4 text-base font-semibold shadow-md flex items-center justify-center space-x-3"
                >
                  <GraduationCap className="w-5 h-5" />
                  <span>Student Login</span>
                </OvalButton>

                <OvalButton
                  variant="outline"
                  onClick={() => setStep('teacher_login')}
                  className="w-full py-4 text-base font-semibold border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[#eaf1ee] flex items-center justify-center space-x-3"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Teacher Login</span>
                </OvalButton>
              </div>
            </motion.div>
          )}

          {step === 'student_login' && (
            <motion.div
              key="student_login"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md mx-auto"
            >
              <StudentAuthForm onBack={() => setStep('role_picker')} />
            </motion.div>
          )}

          {step === 'teacher_login' && (
            <motion.div
              key="teacher_login"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md mx-auto"
            >
              <TeacherAuthForm onBack={() => setStep('role_picker')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto text-center text-xs text-slate-400 py-4 border-t border-slate-200/60 z-10">
        AskFlow Classroom Q&A Portal • Peer Anonymity Enforced
      </footer>
    </div>
  );
}
