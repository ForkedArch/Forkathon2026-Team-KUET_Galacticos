'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { OvalButton } from '@/components/ui/oval-button';
import { GraduationCap, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export function StudentAuthForm({ onBack }: Props) {
  const { loginStudent } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    email: '',
    password: '',
    year: 1,
    term: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password || !formData.name || !formData.rollNumber) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    const res = await loginStudent({
      name: formData.name,
      rollNumber: formData.rollNumber,
      email: formData.email,
      password: formData.password,
      year: Number(formData.year),
      term: Number(formData.term),
      isSignUp,
    });

    setIsSubmitting(false);
    if (res.error) {
      setError(res.error);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          type="button"
          className="text-slate-400 hover:text-slate-600 transition-colors p-1"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-2 text-[var(--color-primary)] bg-[#f0f6f4] px-3 py-1 rounded-full text-xs font-semibold">
          <GraduationCap className="w-4 h-4" />
          <span>Student Portal</span>
        </div>
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          {isSignUp ? 'Create Student Account' : 'Student Login'}
        </h2>
        <p className="text-xs text-slate-500">
          {isSignUp
            ? 'Register to start asking academic doubts anonymously'
            : 'Enter your credentials to access your course dashboard'}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Alex Mercer"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-slate-900"
          />
        </div>

        {/* Roll Number & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Roll Number
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 2103001"
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="student@univ.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-slate-900"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Password
          </label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-slate-900"
          />
        </div>

        {/* Year & Term */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Academic Year
            </label>
            <select
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-slate-900"
            >
              <option value={1}>Year 1</option>
              <option value={2}>Year 2</option>
              <option value={3}>Year 3</option>
              <option value={4}>Year 4</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Term
            </label>
            <select
              value={formData.term}
              onChange={(e) => setFormData({ ...formData, term: Number(e.target.value) })}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-slate-900"
            >
              <option value={1}>Term 1</option>
              <option value={2}>Term 2</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <OvalButton
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 text-sm font-semibold shadow-md"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : isSignUp ? (
              'Create Account & Enter'
            ) : (
              'Sign In as Student'
            )}
          </OvalButton>
        </div>
      </form>

      {/* Switcher */}
      <div className="text-center pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null);
          }}
          className="text-xs font-medium text-[var(--color-primary)] hover:underline"
        >
          {isSignUp
            ? 'Already have an account? Sign In'
            : "Don't have an account? Create Account"}
        </button>
      </div>
    </div>
  );
}
