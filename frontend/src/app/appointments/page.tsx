'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../providers/AuthProvider';
import ScrollReveal from '../../components/animations/ScrollReveal';
import GlassCard from '../../components/ui/GlassCard';
import api from '../../lib/api';
import { Calendar, Clock, BookOpen, FileText, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AppointmentsPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    description: '',
    dateTime: '',
    duration: 30,
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  // Set default date-time to tomorrow at 10:00 AM
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    // Format to YYYY-MM-DDTHH:MM
    const tzoffset = tomorrow.getTimezoneOffset() * 60000; //offset in milliseconds
    const localISOTime = (new Date(tomorrow.getTime() - tzoffset)).toISOString().slice(0, 16);
    setForm((prev) => ({ ...prev, dateTime: localISOTime }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    setSubmitLoading(true);
    setSuccess('');
    setError('');

    try {
      const res = await api.post('/appointments/book', {
        title: form.title,
        description: form.description || null,
        dateTime: new Date(form.dateTime).toISOString(),
        duration: Number(form.duration),
        consultantId: null, // Let backend assign the consultant automatically
      });

      setSuccess(res.data.message || 'Appointment booked successfully!');
      setForm({
        title: '',
        description: '',
        dateTime: form.dateTime,
        duration: 30,
      });
      
      // Redirect to portal dashboard after 3 seconds
      setTimeout(() => {
        router.push('/portal');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to book appointment. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="text-brand-slate-light font-semibold">Checking session authentication...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-indigo hover:text-brand-gold transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side: Information & Guidelines */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <ScrollReveal direction="left" delay={0.1}>
            <span className="text-brand-gold font-bold uppercase tracking-wider text-xs">Educational Advisors</span>
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-brand-blue-deep mt-2 mb-4">Book a Consultation</h1>
            <p className="text-brand-slate-light leading-relaxed text-sm">
              Schedule a bespoke 1-on-1 counseling slot with our senior study abroad consultants. We provide expert advice on:
            </p>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.2}>
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-brand-blue-deep/5 rounded-xl border border-brand-indigo-light/10 text-brand-indigo">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-brand-slate text-sm">University Course Selection</h4>
                  <p className="text-xs text-brand-slate-light mt-1">Determine matching programs in Canada, Australia, the US, or the UK based on your GPA.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-brand-blue-deep/5 rounded-xl border border-brand-indigo-light/10 text-brand-indigo">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-brand-slate text-sm">Visa Documentation Review</h4>
                  <p className="text-xs text-brand-slate-light mt-1">Step-by-step guidance on GIC blocked accounts, sponsor audits, and writing a Statement of Purpose (SOP).</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-brand-blue-deep/5 rounded-xl border border-brand-indigo-light/10 text-brand-indigo">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-brand-slate text-sm">Application Milestones</h4>
                  <p className="text-xs text-brand-slate-light mt-1">Prepare admissions packages, request recommendation letters, and schedule language tests.</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.3}>
            <div className="bg-brand-slate text-white rounded-2xl p-6 relative overflow-hidden mt-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-[45px] pointer-events-none" />
              <div className="relative z-10 flex flex-col gap-2">
                <h3 className="font-serif text-base font-bold text-brand-gold-light">Need Urgent Support?</h3>
                <p className="text-xs text-brand-slate-light leading-relaxed">
                  Call our head office at <strong className="text-white">+1 (555) 019-2834</strong> or drop a quick inquiry on our contact page.
                </p>
                <Link href="/contact" className="text-xs text-brand-gold hover:underline mt-2 inline-flex items-center gap-1 font-semibold">
                  <span>Visit Contact Page</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Side: Form Panel */}
        <div className="lg:col-span-7">
          <ScrollReveal direction="up" delay={0.15}>
            {!isAuthenticated ? (
              <GlassCard className="border border-brand-indigo-light/10 shadow-lg text-center p-8 flex flex-col items-center gap-6">
                <Calendar className="h-16 w-16 text-brand-gold animate-pulse" />
                <div>
                  <h2 className="text-2xl font-serif font-bold text-brand-blue-deep mb-2">Student Account Required</h2>
                  <p className="text-brand-slate-light text-xs max-w-sm mx-auto leading-relaxed">
                    To book and schedule virtual consultation sessions, you must log in to your student profile. If you do not have an account, you can create one in seconds.
                  </p>
                </div>
                <div className="flex gap-4 w-full max-w-xs">
                  <Link
                    href="/contact?tab=login&redirect=/appointments"
                    className="flex-1 text-center py-2.5 bg-blue-gradient text-white text-xs font-semibold rounded-full shadow hover:shadow-gold transition-all"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/contact?tab=register&redirect=/appointments"
                    className="flex-1 text-center py-2.5 border border-brand-indigo-light/25 hover:bg-brand-blue-deep/5 transition-colors rounded-full text-xs font-semibold text-brand-slate"
                  >
                    Register
                  </Link>
                </div>
              </GlassCard>
            ) : (
              <GlassCard className="border border-brand-indigo-light/10 shadow-lg p-8">
                <h2 className="text-2xl font-serif font-bold text-brand-blue-deep mb-2">Schedule Your Session</h2>
                <p className="text-xs text-brand-slate-light mb-8">Logged in as <strong className="text-brand-blue-deep">{user?.firstName} {user?.lastName}</strong></p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-slate mb-1">Appointment Purpose / Title</label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g. Visa Guidance, University Selection"
                      className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-xl px-4 py-2.5 text-xs text-brand-slate"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-slate mb-1">Preferred Date & Time</label>
                      <input
                        type="datetime-local"
                        required
                        value={form.dateTime}
                        onChange={(e) => setForm({ ...form, dateTime: e.target.value })}
                        className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-xl px-4 py-2.5 text-xs text-brand-slate"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-slate mb-1">Duration</label>
                      <select
                        value={form.duration}
                        onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                        className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-xl px-4 py-2.5 text-xs text-brand-slate"
                      >
                        <option value={30}>30 Minutes (Standard Consultation)</option>
                        <option value={45}>45 Minutes (Extended Review)</option>
                        <option value={60}>60 Minutes (Comprehensive Audit)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-slate mb-1">Additional Notes / Inquiry Details (Optional)</label>
                    <textarea
                      rows={4}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Details of what you wish to discuss, test scores, or specific universities you have in mind..."
                      className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-xl px-4 py-2.5 text-xs text-brand-slate resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="w-full py-3 bg-blue-gradient text-white text-xs font-bold rounded-xl shadow hover:shadow-gold transition-all flex items-center justify-center gap-1.5"
                  >
                    {submitLoading ? 'Scheduling Session...' : 'Confirm Consultation Booking'}
                  </button>
                </form>

                {success && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                {error && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </GlassCard>
            )}
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
