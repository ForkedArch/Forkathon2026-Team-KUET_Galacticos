'use client';

import React, { useState, useMemo } from 'react';
import { useAuth } from '@/lib/auth-context';
import { OvalButton } from '@/components/ui/oval-button';
import { BookOpen, ArrowLeft, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { getCoursesByYearAndTerm, COURSE_CATALOG } from '@/lib/constants';

interface Props {
  onBack: () => void;
}

export function TeacherAuthForm({ onBack }: Props) {
  const { loginTeacher } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [year, setYear] = useState<number>(1);
  const [term, setTerm] = useState<number>(1);

  // Filter courses for Year/Term selector
  const availableCourses = useMemo(() => {
    return getCoursesByYearAndTerm(year, term);
  }, [year, term]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    teacherId: '',
    password: '',
    courseCode: availableCourses[0]?.code || 'CSE1101',
  });

  // Automatically update selected course code when Year/Term changes
  const handleYearTermChange = (newYear: number, newTerm: number) => {
    setYear(newYear);
    setTerm(newTerm);
    const courses = getCoursesByYearAndTerm(newYear, newTerm);
    if (courses.length > 0) {
      setFormData((prev) => ({
        ...prev,
        courseCode: courses[0].code,
        teacherId: courses[0].teacherId, // Auto-fill corresponding default teacher ID for convenience
      }));
    }
  };

  const handleCourseChange = (courseCode: string) => {
    const course = COURSE_CATALOG.find((c) => c.code === courseCode);
    setFormData((prev) => ({
      ...prev,
      courseCode,
      teacherId: course ? course.teacherId : prev.teacherId,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password || !formData.name || !formData.teacherId) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    const res = await loginTeacher({
      name: formData.name,
      email: formData.email,
      teacherId: formData.teacherId,
      password: formData.password,
      courseCode: formData.courseCode,
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
          <BookOpen className="w-4 h-4" />
          <span>Faculty Portal</span>
        </div>
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          {isSignUp ? 'Create Faculty Account' : 'Teacher Login'}
        </h2>
        <p className="text-xs text-slate-500">
          {isSignUp
            ? 'Sign up with your assigned Teacher ID to manage course Q&A'
            : 'Access your assigned course question queue'}
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
            Instructor Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Dr. Robert Vance"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-slate-900"
          />
        </div>

        {/* Email & Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Faculty Email
            </label>
            <input
              type="email"
              required
              placeholder="vance@univ.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-slate-900"
            />
          </div>

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
        </div>

        {/* Year & Term to locate Course */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Filter Year
            </label>
            <select
              value={year}
              onChange={(e) => handleYearTermChange(Number(e.target.value), term)}
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
              Filter Term
            </label>
            <select
              value={term}
              onChange={(e) => handleYearTermChange(year, Number(e.target.value))}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-slate-900"
            >
              <option value={1}>Term 1</option>
              <option value={2}>Term 2</option>
            </select>
          </div>
        </div>

        {/* Course Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Assigned Course
          </label>
          <select
            value={formData.courseCode}
            onChange={(e) => handleCourseChange(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-slate-900 font-medium"
          >
            {availableCourses.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Teacher ID */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Assigned Teacher ID
            </label>
            <span className="text-[10px] text-slate-400">
              e.g. cse-1101-0
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="e.g. cse-1101-0"
              value={formData.teacherId}
              onChange={(e) => setFormData({ ...formData, teacherId: e.target.value.toLowerCase() })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-slate-900 font-mono"
            />
            {formData.teacherId && (
              <div className="absolute right-3 top-2.5">
                {COURSE_CATALOG.some((c) => c.teacherId.toLowerCase() === formData.teacherId.trim().toLowerCase()) ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
              </div>
            )}
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
              'Verify & Create Faculty Account'
            ) : (
              'Sign In as Teacher'
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
            ? 'Already registered? Sign In'
            : "First time here? Register with Teacher ID"}
        </button>
      </div>
    </div>
  );
}
