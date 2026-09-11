'use client';

import React, { useState } from 'react';
import { QuestionsStore } from '@/lib/questions-store';
import { Question } from '@/lib/types';
import { OvalButton } from '@/components/ui/oval-button';
import { Search, Plus, ThumbsUp, Mic, Square, Paperclip, X, Image as ImageIcon, FileText, CheckCircle2 } from 'lucide-react';

interface AskDoubtSectionProps {
  courseCode: string;
  studentId: string;
  studentName: string;
  onQuestionCreated: () => void;
  onOpenThread: (q: Question) => void;
}

export function AskDoubtSection({
  courseCode,
  studentId,
  studentName,
  onQuestionCreated,
  onOpenThread,
}: AskDoubtSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [matches, setMatches] = useState<Question[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);

  // Form State
  const [body, setBody] = useState('');
  const [attachment, setAttachment] = useState<{
    url: string;
    type: 'image' | 'audio' | 'pdf';
    name: string;
  } | null>(null);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  // Handle live duplicate search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim().length > 1) {
      setIsSearching(true);
      const results = QuestionsStore.searchQuestions(courseCode, value);
      setMatches(results);
    } else {
      setIsSearching(false);
      setMatches([]);
    }
  };

  // Handle File Select
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let type: 'image' | 'audio' | 'pdf' = 'pdf';
    if (file.type.startsWith('image/')) type = 'image';
    else if (file.type.startsWith('audio/')) type = 'audio';

    const fakeUrl = URL.createObjectURL(file);
    setAttachment({
      url: fakeUrl,
      type,
      name: file.name,
    });
  };

  // Start Audio Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(blob);
        setAttachment({
          url: audioUrl,
          type: 'audio',
          name: 'Voice_Note.webm',
        });
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      alert('Microphone access denied or unavailable.');
    }
  };

  // Stop Audio Recording
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  // Submit New Question
  const handleSubmitNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    try {
      await QuestionsStore.addQuestion({
        studentId,
        studentName,
        courseCode,
        body,
        attachmentUrl: attachment?.url,
        attachmentType: attachment?.type,
      });

      // Reset Form
      setBody('');
      setAttachment(null);
      setSearchQuery('');
      setMatches([]);
      setShowNewForm(false);
      setIsSearching(false);
      onQuestionCreated();
    } catch (err) {
      console.error(err);
    }
  };

  const handleVoteMatch = (e: React.MouseEvent, qId: string) => {
    e.stopPropagation();
    QuestionsStore.toggleVote(qId, studentId);
    setMatches((prev) =>
      prev.map((m) =>
        m.id === qId ? { ...m, voteCount: m.voteCount + 1, hasVoted: true } : m
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
          Search Past Questions in {courseCode} Before Asking
        </label>

        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Type your question keywords (e.g. malloc, memory leak, loops)..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-slate-900 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setMatches([]);
                setIsSearching(false);
              }}
              className="absolute right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Duplicate Search Results */}
      {isSearching && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              {matches.length > 0 ? `Matching Past Questions (${matches.length})` : 'No duplicates found'}
            </h3>
            <button
              onClick={() => setShowNewForm(true)}
              className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post as new question</span>
            </button>
          </div>

          {matches.length > 0 ? (
            <div className="space-y-3">
              {matches.map((q) => (
                <div
                  key={q.id}
                  onClick={() => onOpenThread(q)}
                  className="bg-white p-4 rounded-xl border border-slate-200 hover:border-[var(--color-primary)] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 uppercase">
                      {q.status}
                    </span>
                    <p className="text-xs font-semibold text-slate-800 line-clamp-2">
                      {q.body}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      onClick={(e) => handleVoteMatch(e, q.id)}
                      className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 flex items-center space-x-1"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{q.voteCount} Upvote</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200/80 p-4 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
              <span>No identical question found in past discussions!</span>
              <button
                onClick={() => setShowNewForm(true)}
                className="font-bold underline hover:text-emerald-950 ml-2"
              >
                Post your question now
              </button>
            </div>
          )}
        </div>
      )}

      {/* Post New Question Form Toggle/Container */}
      {(!isSearching || showNewForm) && (
        <form onSubmit={handleSubmitNew} className="bg-slate-50 border border-slate-200/80 p-5 rounded-3xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Plus className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Ask a New Doubt (Peer Anonymous)</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">
              Course: <strong className="text-slate-800">{courseCode}</strong>
            </span>
          </div>

          <textarea
            required
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Type your academic question in detail..."
            className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
          />

          {/* Attachment Preview */}
          {attachment && (
            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700">
              <div className="flex items-center space-x-2 truncate">
                {attachment.type === 'image' && <ImageIcon className="w-4 h-4 text-blue-500" />}
                {attachment.type === 'audio' && <Mic className="w-4 h-4 text-purple-500" />}
                {attachment.type === 'pdf' && <FileText className="w-4 h-4 text-red-500" />}
                <span className="font-semibold truncate">{attachment.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setAttachment(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center space-x-2">
              {/* File Attachment Button */}
              <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors">
                <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                <span>Attach File/Image</span>
                <input
                  type="file"
                  accept="image/*,application/pdf,audio/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>

              {/* Voice Record Button */}
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
                >
                  <Mic className="w-3.5 h-3.5 text-purple-600" />
                  <span>Record Voice</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-full bg-red-100 text-red-700 text-xs font-semibold animate-pulse"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop Recording</span>
                </button>
              )}
            </div>

            <OvalButton type="submit" className="px-8 py-2.5 text-xs font-bold shadow-md">
              Submit Question
            </OvalButton>
          </div>
        </form>
      )}
    </div>
  );
}
