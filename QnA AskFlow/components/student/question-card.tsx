'use client';

import React from 'react';
import { Question } from '@/lib/types';
import { ThumbsUp, Paperclip, CheckCircle, Clock, MessageSquare, Mic, FileText, Image as ImageIcon } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  onVote: (e: React.MouseEvent, questionId: string) => void;
  onClick: (question: Question) => void;
}

export function QuestionCard({ question, onVote, onClick }: QuestionCardProps) {
  const getStatusBadge = () => {
    switch (question.status) {
      case 'solved':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Solved</span>
          </span>
        );
      case 'answered':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200/60">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Answered</span>
          </span>
        );
      case 'unsolved':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200/60">
            <Clock className="w-3.5 h-3.5" />
            <span>Unsolved</span>
          </span>
        );
    }
  };

  const getAttachmentIcon = () => {
    if (!question.attachmentType) return null;
    if (question.attachmentType === 'image') return <ImageIcon className="w-3.5 h-3.5 text-blue-500" />;
    if (question.attachmentType === 'audio') return <Mic className="w-3.5 h-3.5 text-purple-500" />;
    if (question.attachmentType === 'pdf') return <FileText className="w-3.5 h-3.5 text-red-500" />;
    return <Paperclip className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div
      onClick={() => onClick(question)}
      className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-[var(--color-primary)] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          {getStatusBadge()}
          <span className="text-[11px] font-medium text-slate-400">
            {new Date(question.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        {/* PRD Rule: Snippet only, NEVER student name in card view */}
        <p className="text-sm font-medium text-slate-800 line-clamp-3 leading-relaxed group-hover:text-slate-900">
          {question.body}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        {/* Attachment indicator */}
        <div className="flex items-center space-x-1.5 text-slate-500 font-medium">
          {getAttachmentIcon()}
          {question.attachmentType && (
            <span className="capitalize text-[11px] text-slate-500">
              {question.attachmentType} Attachment
            </span>
          )}
        </div>

        {/* Vote count & Upvote button */}
        <button
          onClick={(e) => onVote(e, question.id)}
          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-colors ${
            question.hasVoted
              ? 'bg-[var(--color-primary)] text-white font-bold'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium'
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${question.hasVoted ? 'fill-current' : ''}`} />
          <span>{question.voteCount}</span>
        </button>
      </div>
    </div>
  );
}
