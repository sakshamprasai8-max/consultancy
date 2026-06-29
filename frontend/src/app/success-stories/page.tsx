'use client';

import React from 'react';
import ScrollReveal from '../../components/animations/ScrollReveal';
import GlassCard from '../../components/ui/GlassCard';
import { Award, GraduationCap, MapPin, CheckCircle } from 'lucide-react';

export default function SuccessStoriesPage() {
  const cases = [
    {
      name: 'Julian Everhart',
      uni: 'University of Toronto',
      program: 'M.S. in Computer Science',
      gpa: 'GPA 3.8 / IELTS 7.5',
      achievement: 'Awarded Lester B. Pearson Fellowship coverage',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      timeline: [
        { label: 'Initial Counsel', date: 'Sept 2025' },
        { label: 'Portfolio Audit & Pitch', date: 'Oct 2025' },
        { label: 'U of T Offer Letter', date: 'Jan 2026' },
        { label: 'Canada Visa Approval', date: 'March 2026' },
      ],
    },
    {
      name: 'Samantha Miller',
      uni: 'University of Melbourne',
      program: 'Master of Information Technology',
      gpa: 'GPA 3.5 / IELTS 7.0',
      achievement: '$10,000 Tuition Remission Grant',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      timeline: [
        { label: 'Profile Registration', date: 'Oct 2025' },
        { label: 'SOP Drafting & Submission', date: 'Nov 2025' },
        { label: 'Admissions Call & Grant Offer', date: 'Feb 2026' },
        { label: 'Australia Subclass 500 Granted', date: 'May 2026' },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <ScrollReveal direction="up" delay={0.1}>
          <span className="text-brand-gold font-bold uppercase tracking-wider text-xs">Excellence in Action</span>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-brand-blue-deep mt-2 mb-4">Student Success Chronicles</h1>
          <p className="text-brand-slate-light leading-relaxed">
            Examine the profiles and timelines of applicants placed in top ranking international colleges through our counseling.
          </p>
        </ScrollReveal>
      </div>

      {/* Case studies list */}
      <div className="flex flex-col gap-16 mb-20">
        {cases.map((story, idx) => (
          <ScrollReveal key={story.name} direction="up" delay={idx * 0.15}>
            <GlassCard className="p-8 border border-brand-indigo-light/10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
                
                {/* Visual Bio */}
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-brand-gold/30 shadow-md"
                  />
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-brand-blue-deep">{story.name}</h3>
                    <p className="text-xs text-brand-gold font-semibold uppercase tracking-wider mt-1">{story.program}</p>
                    <p className="text-xs text-brand-slate-light mt-1 flex items-center justify-center lg:justify-start gap-1">
                      <GraduationCap className="h-4 w-4" />
                      <span>{story.uni}</span>
                    </p>
                  </div>
                </div>

                {/* Accomplishments */}
                <div className="flex flex-col gap-4 bg-brand-slate-light/5 p-6 rounded-2xl border border-brand-indigo-light/5">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-wider text-brand-slate-light font-semibold">Profile Score</h4>
                    <p className="text-sm font-semibold text-brand-blue-deep">{story.gpa}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-wider text-brand-slate-light font-semibold">Scholarship Achievement</h4>
                    <p className="text-sm font-semibold text-brand-blue-deep flex items-center gap-1.5 mt-1">
                      <Award className="h-4 w-4 text-brand-gold" />
                      <span>{story.achievement}</span>
                    </p>
                  </div>
                </div>

                {/* Horizontal Timeline */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-[10px] uppercase tracking-wider text-brand-slate-light font-semibold text-center lg:text-left">Application Timeline</h4>
                  <div className="flex justify-between items-start relative before:absolute before:top-4 before:left-1/10 before:w-8/10 before:h-0.5 before:bg-brand-indigo-light/20 z-10">
                    {story.timeline.map((step, stepIdx) => (
                      <div key={step.label} className="flex flex-col items-center text-center flex-1 relative z-20">
                        <div className="h-8 w-8 rounded-full bg-white border-2 border-brand-gold flex items-center justify-center text-brand-gold mb-2 shadow-sm">
                          <CheckCircle className="h-4 w-4 text-brand-gold fill-brand-gold/10" />
                        </div>
                        <p className="text-[10px] font-bold text-brand-blue-deep font-sans">{step.label}</p>
                        <p className="text-[8px] text-brand-slate-light mt-0.5">{step.date}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </GlassCard>
          </ScrollReveal>
        ))}
      </div>

    </div>
  );
}
