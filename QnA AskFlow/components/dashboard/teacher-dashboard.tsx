'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { HelpCircle, LogOut, MessageCircle, ChevronDown } from 'lucide-react';
import { OvalButton } from '@/components/ui/oval-button';
import { QuestionsStore } from '@/lib/questions-store';
import { Question } from '@/lib/types';
import { QuestionCard } from '@/components/student/question-card';
import { TeacherThreadModal } from '@/components/teacher/teacher-thread-modal';

const ITEMS_PER_PAGE = 10;

export function TeacherDashboard() {
  const { teacher, logout } = useAuth();
  
  const [activeOval, setActiveOval] = useState<'top' | 'solved' | 'unsolved'>('unsolved');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [activeThreadQuestion, setActiveThreadQuestion] = useState<Question | null>(null);

  // Load and sort questions based on active filter
  const loadQuestions = async () => {
    if (!teacher) return;
    
    // Get all course questions raw
    // In actual implementation, backend API handles sorting. 
    // Here we implement the strict PRD sorting on local data.
    const allCourseQuestions = await QuestionsStore.getQuestions(teacher.courseCode, 'ask');
    
    let sorted = [...allCourseQuestions];

    if (activeOval === 'unsolved') {
      // PRD: Unsolved sorts by vote count descending, then recency.
      sorted = sorted
        .filter((q) => q.status === 'unsolved' || q.status === 'answered')
        .sort((a, b) => {
          if (b.voteCount !== a.voteCount) {
            return b.voteCount - a.voteCount; // Vote desc
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Recency desc
        });
    } else if (activeOval === 'top') {
      // PRD: Top Voted
      sorted = sorted.sort((a, b) => b.voteCount - a.voteCount);
    } else if (activeOval === 'solved') {
      // PRD: Solved
      sorted = sorted
        .filter((q) => q.status === 'solved')
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }

    setQuestions(sorted);
  };

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE); // Reset pagination on tab switch
    loadQuestions();
  }, [activeOval, teacher?.courseCode]);

  if (!teacher) return null;

  const visibleQuestions = questions.slice(0, visibleCount);
  const hasMore = visibleCount < questions.length;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 flex flex-col font-sans">
      {/* Teacher Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 md:px-8 py-3.5 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo + Name */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-xs font-extrabold text-lg">
              A
            </div>
            <div>
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900">
                AskFlow
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Faculty
              </span>
            </div>
          </div>

          {/* Profile / Logout */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shadow-xs hover:bg-slate-200 transition-colors"
            >
              {teacher.name.charAt(0).toUpperCase()}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 text-xs space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <p className="font-bold text-slate-900 text-sm">{teacher.name}</p>
                  <p className="text-slate-500">{teacher.email}</p>
                  <p className="text-[var(--color-primary)] font-semibold mt-1">
                    Course: {teacher.courseCode} ({teacher.courseName})
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    ID: {teacher.teacherId}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="w-full flex items-center space-x-2 text-red-600 font-semibold p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Teacher Container */}
      <main className="max-w-6xl mx-auto w-full px-4 md:px-8 py-8 flex-1 space-y-8">
        {/* Course Banner */}
        <div className="bg-gradient-to-r from-[#eef4f2] to-[#f4f8f6] p-6 sm:p-8 rounded-3xl border border-slate-200/60 shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
            Assigned Course Queue
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Give solutions to the questions asked by students.
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            Course: <span className="text-slate-900 font-bold">{teacher.courseCode} — {teacher.courseName}</span>
          </p>
        </div>

        {/* Three Filter Ovals */}
        <div className="flex flex-wrap gap-3 items-center">
          <OvalButton
            variant={activeOval === 'top' ? 'primary' : 'outline'}
            onClick={() => setActiveOval('top')}
            className="text-xs sm:text-sm px-6 py-2.5 font-semibold shadow-xs"
          >
            Top Voted
          </OvalButton>

          <OvalButton
            variant={activeOval === 'solved' ? 'primary' : 'outline'}
            onClick={() => setActiveOval('solved')}
            className="text-xs sm:text-sm px-6 py-2.5 font-semibold shadow-xs"
          >
            Solved
          </OvalButton>

          <OvalButton
            variant={activeOval === 'unsolved' ? 'primary' : 'outline'}
            onClick={() => setActiveOval('unsolved')}
            className="text-xs sm:text-sm px-6 py-2.5 font-semibold shadow-xs"
          >
            Unsolved
          </OvalButton>
        </div>

        {/* Question Feed Container */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
            <span>
              {activeOval === 'unsolved' && 'Unsolved & Awaiting Questions'}
              {activeOval === 'top' && 'All Questions by Vote Count'}
              {activeOval === 'solved' && 'Resolved Questions'}
            </span>
            <span>{questions.length} Total</span>
          </div>

          {visibleQuestions.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visibleQuestions.map((q) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    onVote={(e) => {
                      e.stopPropagation(); // Teachers do not vote, block event
                    }}
                    onClick={(selected) => setActiveThreadQuestion(selected)}
                  />
                ))}
              </div>
              
              {hasMore && (
                <div className="flex justify-center pt-4">
                  <OvalButton
                    variant="outline"
                    onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                    className="px-8 py-2.5 text-xs font-bold flex items-center space-x-2"
                  >
                    <span>Load more questions</span>
                    <ChevronDown className="w-4 h-4" />
                  </OvalButton>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-3 shadow-xs">
              <MessageCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">Queue is empty</h3>
              <p className="text-xs text-slate-400">
                There are currently no {activeOval} questions in your assigned course queue.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Teacher Thread Modal */}
      {activeThreadQuestion && (
        <TeacherThreadModal
          question={activeThreadQuestion}
          teacherId={teacher.id}
          onClose={() => setActiveThreadQuestion(null)}
          onReplyPosted={loadQuestions}
        />
      )}
    </div>
  );
}

