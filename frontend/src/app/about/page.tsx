'use client';

import React from 'react';
import ScrollReveal from '../../components/animations/ScrollReveal';
import GlassCard from '../../components/ui/GlassCard';
import { Award, Shield, Target, AwardIcon, Compass } from 'lucide-react';

export default function AboutPage() {
  const values = [
    { title: 'Academic Excellence', desc: 'Prioritizing high-tier university selections and robust student profiles.', icon: Award },
    { title: 'Client Trust & Integrity', desc: 'Clear consultancy contracts, zero hidden costs, and authentic document checks.', icon: Shield },
    { title: 'Global Outlook', desc: 'Navigating multiple international regions to matches student goals with matching opportunities.', icon: Compass },
  ];

  const team = [
    { name: 'Saksham Prasai', role: 'Founder & CEO', bio: 'Expert education consultant with deep insights into international admissions and career pathways for Nepalese students.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
    { name: 'Arthur Pendleton', role: 'Head Study Abroad Consultant', bio: 'Specialist in student visa systems for Canada, Australia, and UK.', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <ScrollReveal direction="up" delay={0.1}>
          <span className="text-brand-gold font-bold uppercase tracking-wider text-xs">Our Institution</span>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-brand-blue-deep mt-2 mb-4">Pioneering Global Education Pathways</h1>
          <p className="text-brand-slate-light leading-relaxed">
            EduConsult Pro was founded with a singular mission: to elevate international student counseling into a professional, transparent, and luxury advisory service.
          </p>
        </ScrollReveal>
      </div>

      {/* Main Philosophy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
        <ScrollReveal direction="left" delay={0.2}>
          <div className="relative h-96 rounded-2xl overflow-hidden border border-brand-indigo-light/10 shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
              alt="Consulting meeting"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-blue-deep/50 to-transparent" />
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={0.3}>
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-serif font-bold text-brand-blue-deep">Crafting Premium Student Portfolios</h2>
            <p className="text-brand-slate-light leading-relaxed">
              We do not believe in mass templates. Every student who registers with EduConsult Pro undergoes an intensive academic audit. We align transcripts, language indicators, test scores, and career ambitions to pitch to the highest-ranking institutions.
            </p>
            <p className="text-brand-slate-light leading-relaxed">
              Over the last decade, we have established direct partnerships with 180+ universities across North America, Europe, and Asia-Pacific, ensuring our portfolios receive priority evaluations.
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Values Grid */}
      <div className="mb-24">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-serif font-bold text-brand-blue-deep">Our Core Ideals</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <ScrollReveal key={value.title} direction="up" delay={index * 0.1}>
              <GlassCard className="h-full">
                <div className="p-3 bg-brand-gold/10 text-brand-gold-dark rounded-xl w-fit mb-6">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-brand-blue-deep mb-3 font-sans">{value.title}</h3>
                <p className="text-sm text-brand-slate-light leading-relaxed">{value.desc}</p>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-brand-gold font-bold uppercase tracking-wider text-xs">Expert Advisors</span>
          <h2 className="text-3xl font-serif font-bold text-brand-blue-deep mt-2">Executive Counselors</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {team.map((member, index) => (
            <ScrollReveal key={member.name} direction="up" delay={index * 0.15}>
              <GlassCard className="flex flex-col sm:flex-row gap-6 items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-brand-gold/20"
                />
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold text-brand-blue-deep font-sans">{member.name}</h3>
                  <span className="text-xs text-brand-gold font-semibold uppercase tracking-wider block mb-2">{member.role}</span>
                  <p className="text-xs text-brand-slate-light leading-relaxed">{member.bio}</p>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </div>

    </div>
  );
}
