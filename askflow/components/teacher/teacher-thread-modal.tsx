'use client';

import React, { useState, useEffect } from 'react';
import { Question, Message } from '@/lib/types';
import { QuestionsStore } from '@/lib/questions-store';
import { OvalButton } from '@/components/ui/oval-button';
import {
  X,
  Send,
  Paperclip,
  Mic,
  Square,
  User,
  GraduationCap,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';

interface TeacherThreadModalProps {
  question: Question | null;
  teacherId: string;
  onClose: () => void;
  onReplyPosted: () => void;
}

export function TeacherThreadModal({
  question,
  teacherId,
  onClose,
  onReplyPosted,
}: TeacherThreadModalProps) {
  const [threadMessages, setThreadMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(question);
  const [replyText, setReplyText] = useState('');
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

  // Submit Reply Message
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() && !attachment) return;

    const newMsg = QuestionsStore.postMessage({
      questionId: currentQuestion.id,
      senderType: 'teacher',
      senderId: teacherId,
      body: replyText,
      attachmentUrl: attachment?.url,
      attachmentType: attachment?.type,
    });

    setThreadMessages((prev) => [...prev, newMsg]);
    setCurrentQuestion((prev) => (prev ? { ...prev, status: 'answered' } : null));
    setReplyText('');
    setAttachment(null);
    onReplyPosted();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="space-y-1">
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
            {/* PRD Mandate: Student name visible INSIDE thread only to teacher */}
            <h2 className="text-sm font-bold text-[var(--color-primary)]">
              Asked by: {currentQuestion.studentName || 'Anonymous Student'}
            </h2>
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
                className={`flex flex-col space-y-2 ${isTeacher ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
                  {isTeacher ? (
                    <>
                      <GraduationCap className="w-4 h-4 text-[var(--color-primary)]" />
                      <span className="font-bold text-[var(--color-primary)]">You (Instructor)</span>
                    </>
                  ) : (
                    <>
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{currentQuestion.studentName || 'Student'}</span>
                    </>
                  )}
                  <span className="text-[10px] text-slate-400">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm space-y-3 ${
                    isTeacher
                      ? 'bg-[var(--color-primary)] text-white shadow-xs'
                      : 'bg-white text-slate-900 border border-slate-200/90 shadow-xs'
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
                </div>
              </div>
            );
          })}
        </div>

        {/* Teacher Reply Composer */}
        <form onSubmit={handleSendReply} className="p-4 bg-white border-t border-slate-200 space-y-3">
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
              id="reply-input"
              type="text"
              placeholder="Type your official instructor reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />

            <label className="p-2.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer transition-colors">
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
                className="p-2.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
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

            <OvalButton type="submit" className="px-5 py-2.5 text-xs font-bold shadow-sm">
              <Send className="w-4 h-4" />
            </OvalButton>
          </div>
        </form>
      </div>
    </div>
  );
}
