'use client';

import React from 'react';
import { Question, StudentProfile } from '@/lib/types';
import { X, LogOut, User, Calendar, GraduationCap, Clock, CheckCircle, MessageSquare } from 'lucide-react';
import { OvalButton } from '@/components/ui/oval-button';

interface StudentHistoryModalProps {
  student: StudentProfile;
  history: Question[];
  onOpenQuestion: (q: Question) => void;
  onLogout: () => void;
  onClose: () => void;
}

export function StudentHistoryModal({
  student,
  history,
  onOpenQuestion,
  onLogout,
  onClose,
}: StudentHistoryModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm">
              {student.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">{student.name}</h2>
              <p className="text-xs text-slate-500 font-medium">
                Roll: {student.rollNumber} • Year {student.year}, Term {student.term}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* History List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Your Asked Questions ({history.length})
            </h3>
          </div>

          {history.length > 0 ? (
            <div className="space-y-3">
              {history.map((q) => (
                <div
                  key={q.id}
                  onClick={() => {
                    onClose();
                    onOpenQuestion(q);
                  }}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-[var(--color-primary)] transition-all cursor-pointer space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                        q.status === 'solved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : q.status === 'answered'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {q.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(q.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-800 line-clamp-2">{q.body}</p>

                  <div className="text-[11px] text-slate-500 font-medium">
                    Upvotes: <strong className="text-slate-800">{q.voteCount}</strong>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-slate-400">
              You haven't asked any questions yet.
            </div>
          )}
        </div>

        {/* Footer with Logout */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-between items-center">
          <span className="text-xs text-slate-400 font-medium">{student.email}</span>
          <button
            onClick={onLogout}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
