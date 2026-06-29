'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ThreeBackground from '../components/animations/ThreeBackground';
import ScrollReveal from '../components/animations/ScrollReveal';
import GlassCard from '../components/ui/GlassCard';
import api from '../lib/api';
import { 
  ArrowRight, 
  Users, 
  Award, 
  MapPin, 
  BookOpen, 
  Briefcase, 
  ChevronRight, 
  CheckCircle,
  FileText,
  Calendar,
  DollarSign
} from 'lucide-react';

export default function HomePage() {
  // Consultation form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Initial Counseling Inquiry',
    message: '',
    type: 'COUNSELING',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await api.post('/contact', formData);
      setMessage('Your counseling session request has been submitted successfully! A consultant will email you.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Initial Counseling Inquiry',
        message: '',
        type: 'COUNSELING',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const countries = [
    { name: 'Canada', slug: 'canada', code: 'CA', count: '45+ Universities', bg: 'from-red-500/20 to-red-900/20' },
    { name: 'Australia', slug: 'australia', code: 'AU', count: '30+ Universities', bg: 'from-blue-500/20 to-blue-900/20' },
    { name: 'United Kingdom', slug: 'united-kingdom', code: 'GB', count: '50+ Universities', bg: 'from-purple-500/20 to-purple-900/20' },
    { name: 'United States', slug: 'united-states', code: 'US', count: '80+ Universities', bg: 'from-emerald-500/20 to-emerald-900/20' },
  ];

  const stats = [
    { number: '98%', label: 'Visa Approval Rate', icon: Award },
    { number: '12K+', label: 'Global Students Placed', icon: Users },
    { number: '180+', label: 'Partner Universities', icon: BookOpen },
    { number: '15+', label: 'Years of Experience', icon: Briefcase },
  ];

  return (
    <div className="relative w-full">
      {/* 1. Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-6 pb-12 pt-20">
        <ThreeBackground />
        
        <div className="max-w-7xl mx-auto w-full text-center relative z-10">
          <ScrollReveal direction="up" delay={0.1}>
            <span className="px-4 py-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/5 text-brand-gold-dark text-xs font-semibold uppercase tracking-widest inline-block mb-6">
              World-Class Educational Advisory
            </span>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.25} duration={0.8}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-brand-blue-deep leading-tight font-serif mb-6">
              Your Gateway to <br />
              <span className="text-gold-gradient">Global Education</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4}>
            <p className="max-w-2xl mx-auto text-base md:text-lg text-brand-slate-light leading-relaxed mb-10">
              Bespoke university placements, visa counseling, and document auditing designed for students aiming for world-renowned institutions.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.5}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/appointments"
                className="px-8 py-3.5 rounded-full bg-blue-gradient text-white text-base font-semibold shadow hover:shadow-gold hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
              >
                <span>Book Free Assessment</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/services"
                className="px-8 py-3.5 rounded-full border border-brand-indigo-light/20 bg-white/20 hover:bg-white/50 text-brand-blue-deep font-semibold transition-all duration-300"
              >
                Explore Services
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* Floating cards at base of hero */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden lg:flex gap-8 max-w-5xl w-full px-6">
          {stats.slice(0, 3).map((stat, idx) => (
            <div key={idx} className="flex-1 glass p-4 rounded-xl flex items-center gap-4 border border-brand-indigo-light/5 shadow-sm">
              <div className="p-2.5 rounded-lg bg-brand-indigo-light/10 text-brand-indigo">
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-brand-blue-deep font-sans">{stat.number}</h4>
                <p className="text-xs text-brand-slate-light">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Key Metrics Section */}
      <section className="py-20 bg-brand-slate text-white relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <ScrollReveal key={idx} direction="up" delay={idx * 0.1} className="text-center flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-brand-gold mb-4 border border-white/10">
                <stat.icon className="h-6 w-6" />
              </div>
              <h3 className="text-3xl md:text-5xl font-extrabold font-sans text-brand-gold-light mb-2">{stat.number}</h3>
              <p className="text-xs md:text-sm text-brand-slate-light uppercase tracking-widest">{stat.label}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 3. Services We Provide */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-gold font-bold uppercase tracking-wider text-xs">Excellence in Service</span>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-blue-deep mt-2 mb-4 font-serif">Bespoke Academic Guidance</h2>
            <p className="text-brand-slate-light">From initial language evaluations to landing clearances, we handle every stage of your study abroad pipeline.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ScrollReveal direction="up" delay={0.1}>
              <GlassCard className="hover-gold-grow h-full flex flex-col justify-between">
                <div>
                  <div className="p-3 bg-brand-indigo-light/10 text-brand-indigo w-fit rounded-xl mb-6">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-blue-deep mb-3">Student Visa Consulting</h3>
                  <p className="text-sm text-brand-slate-light leading-relaxed mb-6">
                    Comprehensive study permit files checking, mock interviews, and financial audit assistance to ensure highest visa success rates.
                  </p>
                </div>
                <Link href="/services" className="flex items-center gap-1.5 text-brand-indigo font-semibold text-sm hover:text-brand-gold transition-colors">
                  <span>Learn More</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </GlassCard>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <GlassCard className="hover-gold-grow h-full flex flex-col justify-between">
                <div>
                  <div className="p-3 bg-brand-indigo-light/10 text-brand-indigo w-fit rounded-xl mb-6">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-blue-deep mb-3">University Admission Assistance</h3>
                  <p className="text-sm text-brand-slate-light leading-relaxed mb-6">
                    Direct representation with leading universities. We manage application cycles, portfolio submissions, and document timelines.
                  </p>
                </div>
                <Link href="/services" className="flex items-center gap-1.5 text-brand-indigo font-semibold text-sm hover:text-brand-gold transition-colors">
                  <span>Learn More</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </GlassCard>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <GlassCard className="hover-gold-grow h-full flex flex-col justify-between">
                <div>
                  <div className="p-3 bg-brand-indigo-light/10 text-brand-indigo w-fit rounded-xl mb-6">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-blue-deep mb-3">Scholarship Support</h3>
                  <p className="text-sm text-brand-slate-light leading-relaxed mb-6">
                    Matching qualified students with full tuition waivers, graduate research assistantships, and exclusive regional bursaries.
                  </p>
                </div>
                <Link href="/services" className="flex items-center gap-1.5 text-brand-indigo font-semibold text-sm hover:text-brand-gold transition-colors">
                  <span>Learn More</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </GlassCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4. Study Destinations */}
      <section className="py-24 bg-brand-slate-light/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-brand-gold font-bold uppercase tracking-wider text-xs">Global Destinations</span>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-blue-deep mt-2 font-serif">Countries We Serve</h2>
            </div>
            <Link href="/countries" className="text-sm font-semibold text-brand-indigo hover:text-brand-gold flex items-center gap-1">
              <span>View All Countries</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {countries.map((country, idx) => (
              <ScrollReveal key={country.name} direction="up" delay={idx * 0.1}>
                <Link href={`/countries/${country.slug}`} className="group block">
                  <div className="glass-dark rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-brand-gold/30 hover:-translate-y-1 h-64 flex flex-col justify-between">
                    {/* Background tint based on country */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${country.bg} opacity-20 group-hover:opacity-40 transition-opacity`} />
                    <div className="relative z-10 flex justify-between items-start">
                      <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">{country.code}</span>
                      <ChevronRight className="h-5 w-5 text-brand-blue-deep/30 group-hover:text-brand-gold transition-colors group-hover:translate-x-1" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="font-serif text-2xl font-bold text-brand-blue-deep group-hover:text-brand-indigo transition-colors">{country.name}</h3>
                      <p className="text-xs text-brand-slate-light mt-1">{country.count}</p>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Quick Consultation Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-6">
          <GlassCard className="p-8 md:p-12 relative overflow-hidden border border-brand-indigo-light/10 shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-indigo/5 rounded-full blur-[60px] pointer-events-none" />

            <div className="relative z-10">
              <div className="text-center max-w-xl mx-auto mb-10">
                <span className="text-brand-gold font-bold uppercase tracking-wider text-xs">Begin Your Journey</span>
                <h2 className="text-3xl font-serif font-bold text-brand-blue-deep mt-2 mb-3">Request a Counseling Call</h2>
                <p className="text-sm text-brand-slate-light">Fill in your contact parameters and one of our dedicated student counselors will arrange a consultation session.</p>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-slate mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-lg px-4 py-3 text-sm text-brand-slate"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-slate mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-lg px-4 py-3 text-sm text-brand-slate"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-slate mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-lg px-4 py-3 text-sm text-brand-slate"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-slate mb-2">Your Profile Inquiries / Remarks</label>
                  <textarea
                    required
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your target programs and academic qualification."
                    className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-lg px-4 py-3 text-sm text-brand-slate resize-none"
                  />
                </div>
                
                <div className="md:col-span-2 text-center mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3.5 bg-blue-gradient text-white text-sm font-semibold rounded-full hover:shadow-gold shadow transition-all duration-300 w-full md:w-auto"
                  >
                    {loading ? 'Submitting...' : 'Request Counseling Assessment'}
                  </button>
                </div>
              </form>

              {message && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg text-center font-medium">
                  {message}
                </div>
              )}
              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg text-center font-medium">
                  {error}
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
