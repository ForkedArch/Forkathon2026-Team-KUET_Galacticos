'use client';

import React, { useState, useEffect } from 'react';
import { Question, Message } from '@/lib/types';
import { QuestionsStore } from '@/lib/questions-store';
import { OvalButton } from '@/components/ui/oval-button';
import {
  X,
  Check,
  X as CancelIcon,
  Send,
  Paperclip,
  Mic,
  Square,
  User,
  GraduationCap,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface QuestionThreadModalProps {
  question: Question | null;
  studentId: string;
  onClose: () => void;
  onStatusUpdated: () => void;
}

export function QuestionThreadModal({
  question,
  studentId,
  onClose,
  onStatusUpdated,
}: QuestionThreadModalProps) {
  const [threadMessages, setThreadMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(question);
  const [followupText, setFollowupText] = useState('');
  const [attachment, setAttachment] = useState<{
    url: string;
    type: 'image' | 'audio' | 'pdf';
    name: string;
  } | null>(null);

  // Audio Recording
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  useEffect(() => {
    if (question) {
      setCurrentQuestion(question);
      const msgs = QuestionsStore.getThread(question.id);
      setThreadMessages(msgs);
    }
  }, [question]);

  if (!currentQuestion) return null;

  const isOwner = currentQuestion.studentId === studentId;

  // Mark Solved (Green ✓ Tapped)
  const handleMarkSolved = () => {
    if (!isOwner) return;
    QuestionsStore.markSolved(currentQuestion.id, studentId);
    setCurrentQuestion((prev) => (prev ? { ...prev, status: 'solved' } : null));
    onStatusUpdated();
  };

  // Attach File
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let type: 'image' | 'audio' | 'pdf' = 'pdf';
    if (file.type.startsWith('image/')) type = 'image';
    else if (file.type.startsWith('audio/')) type = 'audio';

    setAttachment({
      url: URL.createObjectURL(file),
      type,
      name: file.name,
    });
  };

  // Start Voice Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAttachment({
          url: URL.createObjectURL(blob),
          type: 'audio',
          name: 'Voice_Note.webm',
        });
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      alert('Microphone permission denied.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  // Submit Follow-up Message
  const handleSendFollowup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followupText.trim() && !attachment) return;

    const newMsg = QuestionsStore.postMessage({
      questionId: currentQuestion.id,
      senderType: 'student',
      senderId: studentId,
      body: followupText,
      attachmentUrl: attachment?.url,
      attachmentType: attachment?.type,
    });

    setThreadMessages((prev) => [...prev, newMsg]);
    setFollowupText('');
    setAttachment(null);
    onStatusUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Question Thread
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                  currentQuestion.status === 'solved'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : currentQuestion.status === 'answered'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {currentQuestion.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Posted: {new Date(currentQuestion.createdAt).toLocaleString()}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/50">
          {threadMessages.map((msg) => {
            const isTeacher = msg.senderType === 'teacher';
            return (
              <div
                key={msg.id}
                className={`flex flex-col space-y-2 ${isTeacher ? 'items-start' : 'items-end'}`}
              >
                <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
                  {isTeacher ? (
                    <>
                      <GraduationCap className="w-4 h-4 text-[var(--color-primary)]" />
                      <span className="font-bold text-[var(--color-primary)]">Instructor</span>
                    </>
                  ) : (
                    <>
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{isOwner ? 'You (Student)' : 'Student'}</span>
                    </>
                  )}
                  <span className="text-[10px] text-slate-400">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm space-y-3 ${
                    isTeacher
                      ? 'bg-white text-slate-900 border border-slate-200/90 shadow-xs'
                      : 'bg-[var(--color-primary)] text-white shadow-xs'
                  }`}
                >
                  {msg.body && <p className="leading-relaxed whitespace-pre-wrap">{msg.body}</p>}

                  {/* Attachment in Message */}
                  {msg.attachmentUrl && (
                    <div className="pt-2 border-t border-slate-100/20">
                      {msg.attachmentType === 'image' && (
                        <img
                          src={msg.attachmentUrl}
                          alt="Attachment"
                          className="max-h-48 rounded-xl object-contain border border-slate-200"
                        />
                      )}
                      {msg.attachmentType === 'audio' && (
                        <audio controls src={msg.attachmentUrl} className="w-full h-8" />
                      )}
                      {msg.attachmentType === 'pdf' && (
                        <a
                          href={msg.attachmentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-2 text-xs font-semibold underline"
                        >
                          <FileText className="w-4 h-4" />
                          <span>View PDF Document</span>
                        </a>
                      )}
                    </div>
                  )}

                  {/* PRD Mandate: Under each teacher reply: green ✓ ("satisfied", marks question Solved) and red ✗ ("not satisfied") */}
                  {isTeacher && isOwner && currentQuestion.status !== 'solved' && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-slate-500">Are you satisfied with this response?</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleMarkSolved}
                          title="Satisfied - Mark Solved"
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-full font-bold text-xs border border-emerald-200 transition-colors"
                        >
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Satisfied (Solved)</span>
                        </button>
                        <button
                          onClick={() => {
                            const el = document.getElementById('followup-input');
                            el?.focus();
                          }}
                          title="Not Satisfied - Ask Followup"
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-full font-bold text-xs border border-red-200 transition-colors"
                        >
                          <CancelIcon className="w-4 h-4 text-red-600" />
                          <span>Not Satisfied</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Follow-up Composer Footer */}
        {currentQuestion.status !== 'solved' ? (
          <form onSubmit={handleSendFollowup} className="p-4 bg-white border-t border-slate-200 space-y-3">
            {attachment && (
              <div className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-xl text-xs text-slate-700">
                <span className="font-semibold truncate">{attachment.name}</span>
                <button type="button" onClick={() => setAttachment(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                id="followup-input"
                type="text"
                placeholder="Type a follow-up doubt or clarification..."
                value={followupText}
                onChange={(e) => setFollowupText(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />

              <label className="p-2.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer">
                <Paperclip className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*,application/pdf,audio/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>

              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="p-2.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  <Mic className="w-4 h-4 text-purple-600" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="p-2.5 rounded-full bg-red-100 text-red-600 animate-pulse"
                >
                  <Square className="w-4 h-4 fill-current" />
                </button>
              )}

              <OvalButton type="submit" className="px-5 py-2.5 text-xs font-bold">
                <Send className="w-4 h-4" />
              </OvalButton>
            </div>
          </form>
        ) : (
          <div className="p-4 bg-emerald-50 border-t border-emerald-100 text-center text-xs font-bold text-emerald-800 flex items-center justify-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>This question has been marked Solved by the student.</span>
          </div>
        )}
      </div>
    </div>
  );
}
