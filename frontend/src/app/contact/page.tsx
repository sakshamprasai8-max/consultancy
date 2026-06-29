'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../providers/AuthProvider';
import ScrollReveal from '../../components/animations/ScrollReveal';
import GlassCard from '../../components/ui/GlassCard';
import api from '../../lib/api';
import { Mail, Phone, MapPin, Send, User, Lock, Chrome, MailCheck } from 'lucide-react';

function ContactContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login, register, googleLogin, user } = useAuth();

  const [activeTab, setActiveTab] = useState<'contact' | 'login' | 'register'>('contact');

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', type: 'GENERAL' });
  const [contactSuccess, setContactSuccess] = useState('');
  const [contactError, setContactError] = useState('');
  const [contactLoading, setContactLoading] = useState(false);

  // Auth states
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFirstName, setAuthFirstName] = useState('');
  const [authLastName, setAuthLastName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'login') {
      setActiveTab('login');
    } else if (tab === 'register') {
      setActiveTab('register');
    } else {
      setActiveTab('contact');
    }
  }, [searchParams]);

  // Sync tab switch in URL
  const switchTab = (tab: 'contact' | 'login' | 'register') => {
    setActiveTab(tab);
    router.push(`/contact?tab=${tab}`);
  };

  // Contact handler
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    setContactSuccess('');
    setContactError('');

    try {
      await api.post('/contact', contactForm);
      setContactSuccess('Your message was delivered! We will contact you within 24 hours.');
      setContactForm({ name: '', email: '', phone: '', subject: '', message: '', type: 'GENERAL' });
    } catch (err: any) {
      setContactError(err.response?.data?.message || 'Failed to submit contact request.');
    } finally {
      setContactLoading(false);
    }
  };

  // Login handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      await login(authEmail, authPassword);
    } catch (err: any) {
      setAuthError(err.message || 'Login failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Register handler
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      await register(authEmail, authPassword, authFirstName, authLastName, authPhone);
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Simulated Google login trigger
  const handleGoogleSso = async () => {
    setAuthLoading(true);
    setAuthError('');
    try {
      // Mock Google OAuth login
      await googleLogin('sso_student@educonsultpro.com', 'SSO', 'User', 'google_sso_123');
    } catch (err: any) {
      setAuthError(err.message || 'Google OAuth failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      
      {/* Tab Selectors */}
      <div className="flex justify-center mb-12">
        <div className="bg-brand-slate-light/10 p-1.5 rounded-full flex gap-1">
          <button
            onClick={() => switchTab('contact')}
            className={`px-6 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${activeTab === 'contact' ? 'bg-brand-blue-deep text-white shadow' : 'text-brand-slate-light hover:text-brand-slate'}`}
          >
            Contact Office
          </button>
          <button
            onClick={() => switchTab('login')}
            className={`px-6 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${activeTab === 'login' ? 'bg-brand-blue-deep text-white shadow' : 'text-brand-slate-light hover:text-brand-slate'}`}
          >
            Portal Log In
          </button>
          <button
            onClick={() => switchTab('register')}
            className={`px-6 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${activeTab === 'register' ? 'bg-brand-blue-deep text-white shadow' : 'text-brand-slate-light hover:text-brand-slate'}`}
          >
            Create Account
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* Sidebar Info */}
        <div className="flex flex-col gap-6">
          <ScrollReveal direction="left" delay={0.1}>
            <div className="glass rounded-2xl p-6 border border-brand-indigo-light/10">
              <h3 className="font-serif text-xl font-bold text-brand-blue-deep border-b border-brand-indigo-light/10 pb-3 mb-4">Nepal Head Office</h3>
              <div className="flex flex-col gap-4 text-xs text-brand-slate-light">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-brand-gold flex-shrink-0" />
                  <span>Gatthaghar, Madhyapur Thimi, Bhaktapur, Nepal</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-brand-gold flex-shrink-0" />
                  <span>+977 9802481462</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-brand-gold flex-shrink-0" />
                  <span>saksham@educonsultpro.com</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.2}>
            <div className="bg-brand-slate text-white rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-[45px] pointer-events-none" />
              <div className="relative z-10">
                <h3 className="font-serif text-lg font-bold text-brand-gold-light mb-3">Student Portals</h3>
                <p className="text-xs text-brand-slate-light leading-relaxed">
                  Log in to upload transcripts, track study permits timeline, and join virtual video consulting slots directly.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Form panel based on selected Tab */}
        <div className="lg:col-span-2">
          
          {/* Tab 1: Contact Form */}
          {activeTab === 'contact' && (
            <ScrollReveal direction="up" delay={0.15}>
              <GlassCard className="border border-brand-indigo-light/10 shadow-lg">
                <h2 className="text-2xl font-serif font-bold text-brand-blue-deep mb-6">Drop Us a Message</h2>
                <form onSubmit={handleContactSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-slate mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-xl px-4 py-2.5 text-xs text-brand-slate"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-slate mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="e.g. john@example.com"
                      className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-xl px-4 py-2.5 text-xs text-brand-slate"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-slate mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      placeholder="e.g. Admission guidelines for Germany"
                      className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-xl px-4 py-2.5 text-xs text-brand-slate"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-slate mb-1">Detailed Inquiry</label>
                    <textarea
                      required
                      rows={5}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Details of your academic history, target intake dates, and inquiries..."
                      className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-xl px-4 py-2.5 text-xs text-brand-slate resize-none"
                    />
                  </div>

                  <div className="md:col-span-2 text-right">
                    <button
                      type="submit"
                      disabled={contactLoading}
                      className="px-6 py-2.5 bg-blue-gradient text-white text-xs font-semibold rounded-full shadow hover:shadow-gold transition-all flex items-center gap-1.5 ml-auto"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>{contactLoading ? 'Sending...' : 'Send Message'}</span>
                    </button>
                  </div>
                </form>

                {contactSuccess && <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs font-medium text-center">{contactSuccess}</div>}
                {contactError && <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium text-center">{contactError}</div>}
              </GlassCard>
            </ScrollReveal>
          )}

          {/* Tab 2: Login form */}
          {activeTab === 'login' && (
            <ScrollReveal direction="up" delay={0.15}>
              <GlassCard className="max-w-md mx-auto border border-brand-indigo-light/10 shadow-lg p-8">
                <h2 className="text-2xl font-serif font-bold text-brand-blue-deep text-center mb-1">Welcome Back</h2>
                <p className="text-center text-xs text-brand-slate-light mb-8">Access your applications and files pipeline</p>
                
                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-brand-slate-light" />
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="Student Email address"
                      className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-xs text-brand-slate"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4.5 w-4.5 text-brand-slate-light" />
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="Account Password"
                      className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-xs text-brand-slate"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full text-center py-3 bg-blue-gradient text-white text-xs font-bold rounded-xl shadow mt-2"
                  >
                    {authLoading ? 'Signing In...' : 'Sign In'}
                  </button>

                  <div className="relative my-4 flex items-center justify-center">
                    <hr className="w-full border-brand-slate-light/10" />
                    <span className="absolute bg-white px-3 text-[10px] uppercase text-brand-slate-light font-bold">Or SSO Connect</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSso}
                    disabled={authLoading}
                    className="w-full flex items-center justify-center gap-2 border border-brand-indigo-light/25 hover:bg-brand-blue-deep/5 transition-colors py-2.5 rounded-xl text-xs font-semibold text-brand-slate"
                  >
                    <Chrome className="h-4 w-4 text-red-500" />
                    <span>Login with Google</span>
                  </button>
                </form>

                {authError && <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium text-center">{authError}</div>}
              </GlassCard>
            </ScrollReveal>
          )}

          {/* Tab 3: Register form */}
          {activeTab === 'register' && (
            <ScrollReveal direction="up" delay={0.15}>
              <GlassCard className="max-w-md mx-auto border border-brand-indigo-light/10 shadow-lg p-8">
                <h2 className="text-2xl font-serif font-bold text-brand-blue-deep text-center mb-1">Create Student Profile</h2>
                <p className="text-center text-xs text-brand-slate-light mb-8">Register to track applications and book consultants</p>
                
                <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="First Name"
                      value={authFirstName}
                      onChange={(e) => setAuthFirstName(e.target.value)}
                      className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-xl px-4 py-2.5 text-xs text-brand-slate"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Last Name"
                      value={authLastName}
                      onChange={(e) => setAuthLastName(e.target.value)}
                      className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-xl px-4 py-2.5 text-xs text-brand-slate"
                    />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-xl px-4 py-2.5 text-xs text-brand-slate"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Coordinates (Optional)"
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-xl px-4 py-2.5 text-xs text-brand-slate"
                  />
                  <input
                    type="password"
                    required
                    placeholder="Secure Password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-xl px-4 py-2.5 text-xs text-brand-slate"
                  />

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full text-center py-3 bg-blue-gradient text-white text-xs font-bold rounded-xl shadow mt-2"
                  >
                    {authLoading ? 'Creating Profile...' : 'Complete Register'}
                  </button>

                  <div className="relative my-4 flex items-center justify-center">
                    <hr className="w-full border-brand-slate-light/10" />
                    <span className="absolute bg-white px-3 text-[10px] uppercase text-brand-slate-light font-bold">Or OAuth SSO</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSso}
                    disabled={authLoading}
                    className="w-full flex items-center justify-center gap-2 border border-brand-indigo-light/25 hover:bg-brand-blue-deep/5 transition-colors py-2.5 rounded-xl text-xs font-semibold text-brand-slate"
                  >
                    <Chrome className="h-4 w-4 text-red-500" />
                    <span>Register with Google</span>
                  </button>
                </form>

                {authError && <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium text-center">{authError}</div>}
              </GlassCard>
            </ScrollReveal>
          )}

        </div>

      </div>

    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="text-brand-slate-light font-semibold">Loading contact portal...</p>
      </div>
    }>
      <ContactContent />
    </Suspense>
  );
}
