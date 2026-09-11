'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { COURSE_CATALOG } from '@/lib/constants';
import { QuestionsStore } from '@/lib/questions-store';
import { Question, NotificationItem } from '@/lib/types';
import { OvalButton } from '@/components/ui/oval-button';
import { QuestionCard } from '@/components/student/question-card';
import { AskDoubtSection } from '@/components/student/ask-doubt-section';
import { QuestionThreadModal } from '@/components/student/question-thread-modal';
import { NotificationsPopover } from '@/components/student/notifications-popover';
import { StudentHistoryModal } from '@/components/student/student-history-modal';
import { Bell, User, BookOpen, Sparkles, MessageCircle, RefreshCw } from 'lucide-react';

export function StudentDashboard() {
  const { student, logout } = useAuth();

  // Courses available for student's Year & Term
  const availableCourses = student
    ? COURSE_CATALOG.filter((c) => c.year === student.year && c.term === student.term)
    : [];

  const [selectedCourse, setSelectedCourse] = useState<string>(
    availableCourses[0]?.code || 'CSE1101'
  );

  // Active Oval Tab: 'ask' | 'unsolved' | 'top' | 'solved'
  const [activeTab, setActiveTab] = useState<'ask' | 'unsolved' | 'top' | 'solved'>('ask');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeThreadQuestion, setActiveThreadQuestion] = useState<Question | null>(null);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Profile Modal
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Load questions when course, tab, or user changes
  const loadQuestions = async () => {
    if (!student) return;
    const data = await QuestionsStore.getQuestions(selectedCourse, activeTab, student.id);
    setQuestions(data);
  };

  // Load notifications
  const loadNotifications = () => {
    if (!student) return;
    const notifs = QuestionsStore.getStoredNotifications().filter(
      (n) => n.recipientId === student.id || n.recipientType === 'student'
    );
    setNotifications(notifs);
  };

  useEffect(() => {
    loadQuestions();
    loadNotifications();
  }, [selectedCourse, activeTab, student?.id]);

  if (!student) return null;

  const handleVote = (e: React.MouseEvent, questionId: string) => {
    e.stopPropagation();
    QuestionsStore.toggleVote(questionId, student.id);
    loadQuestions();
  };

  const handleNotificationClick = async (notif: NotificationItem) => {
    setShowNotifications(false);
    // Find question and open thread
    const allQ = await QuestionsStore.getQuestions(selectedCourse, 'ask', student.id);
    const targetQ = allQ.find((q) => q.id === notif.questionId);
    if (targetQ) {
      setActiveThreadQuestion(targetQ);
    }
  };

  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Logo & Wordmark Top-Left */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-extrabold text-lg shadow-xs">
            A
          </div>
          <div>
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900">
              AskFlow
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Student
            </span>
          </div>
        </div>

        {/* Course Dropdown & Actions Top-Right */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Select Course Dropdown */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-slate-500 hidden sm:inline" />
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer"
            >
              {availableCourses.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 relative transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
              )}
            </button>

            {showNotifications && (
              <NotificationsPopover
                notifications={notifications}
                onNotificationClick={handleNotificationClick}
                onClose={() => setShowNotifications(false)}
              />
            )}
          </div>

          {/* Student Profile Icon */}
          <button
            onClick={() => setShowProfileModal(true)}
            className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs hover:bg-slate-200 transition-colors"
            title="Student Profile & History"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Banner Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Course Discussion Feed
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Currently viewing <strong className="text-slate-800">{selectedCourse}</strong> for Year {student.year}, Term {student.term}.
            </p>
          </div>

          <button
            onClick={loadQuestions}
            className="self-start sm:self-auto inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Feed</span>
          </button>
        </div>

        {/* Four Ovals under the Header (PRD Requirement) */}
        <div className="flex flex-wrap items-center gap-3">
          <OvalButton
            variant={activeTab === 'ask' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('ask')}
            className="px-6 py-2.5 text-xs font-bold shadow-xs"
          >
            Ask your doubt
          </OvalButton>

          <OvalButton
            variant={activeTab === 'unsolved' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('unsolved')}
            className="px-6 py-2.5 text-xs font-bold shadow-xs"
          >
            Unsolved questions
          </OvalButton>

          <OvalButton
            variant={activeTab === 'top' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('top')}
            className="px-6 py-2.5 text-xs font-bold shadow-xs"
          >
            Top vote
          </OvalButton>

          <OvalButton
            variant={activeTab === 'solved' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('solved')}
            className="px-6 py-2.5 text-xs font-bold shadow-xs"
          >
            Solved questions
          </OvalButton>
        </div>

        {/* Tab Content Section */}
        {activeTab === 'ask' ? (
          <AskDoubtSection
            courseCode={selectedCourse}
            studentId={student.id}
            studentName={student.name}
            onQuestionCreated={() => {
              setActiveTab('unsolved');
              loadQuestions();
            }}
            onOpenThread={(q) => setActiveThreadQuestion(q)}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>
                {activeTab === 'unsolved' && 'Unsolved & Awaiting Confirmation'}
                {activeTab === 'top' && 'Questions Ranked by Top Votes'}
                {activeTab === 'solved' && 'Confirmed Solved Questions'}
              </span>
              <span>{questions.length} Questions</span>
            </div>

            {questions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions.map((q) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    onVote={handleVote}
                    onClick={(selected) => setActiveThreadQuestion(selected)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-3">
                <MessageCircle className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-700">No questions found</h3>
                <p className="text-xs text-slate-400">
                  There are currently no questions in this category for {selectedCourse}.
                </p>
                <OvalButton
                  onClick={() => setActiveTab('ask')}
                  className="mt-2 px-6 py-2 text-xs font-bold"
                >
                  Be the first to ask
                </OvalButton>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Active Question Thread Modal */}
      {activeThreadQuestion && (
        <QuestionThreadModal
          question={activeThreadQuestion}
          studentId={student.id}
          onClose={() => setActiveThreadQuestion(null)}
          onStatusUpdated={loadQuestions}
        />
      )}

      {/* Student History Modal */}
      {showProfileModal && (
        <StudentHistoryModal
          student={student}
          history={QuestionsStore.getStudentHistory(student.id)}
          onOpenQuestion={(q) => setActiveThreadQuestion(q)}
          onLogout={logout}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
}
