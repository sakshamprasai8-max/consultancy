'use client';

import React from 'react';
import Link from 'next/link';
import ScrollReveal from '../../components/animations/ScrollReveal';
import GlassCard from '../../components/ui/GlassCard';
import { 
  FileCheck, 
  Globe, 
  GraduationCap, 
  Compass, 
  BookOpen, 
  Award, 
  Briefcase,
  ArrowRight
} from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      title: 'Student Visa Consulting',
      desc: 'Expert assembly of study permit applications. We verify declarations, explain blocked account pathways, audit parent sponsor declarations, and hold rigorous mock visa interviews.',
      icon: FileCheck,
    },
    {
      title: 'Study Abroad Programs',
      desc: 'Counseling regarding intakes, degree lengths, work-permit structures, and PR rules across Canada, Australia, UK, USA, Germany, Japan, and New Zealand.',
      icon: Globe,
    },
    {
      title: 'University Admission Assistance',
      desc: 'Complete portfolio reviews, essay auditing, CV formatting, and recommendation guidelines to submit standout applications to top tier global universities.',
      icon: GraduationCap,
    },
    {
      title: 'Career Counseling',
      desc: 'Psychometric indicators analysis, employment market forecasting, and course matching. We align academic pathways with long-term professional targets.',
      icon: Compass,
    },
    {
      title: 'Language Preparation',
      desc: 'Exclusive classes, practice materials, and mock feedback for English language evaluations (IELTS Academic, TOEFL iBT, PTE) and specialized tests (GRE, GMAT).',
      icon: BookOpen,
    },
    {
      title: 'Scholarship Assistance',
      desc: 'Matching qualified applicants with fully-funded fellowships, research assistants grants, and corporate scholarships. We edit scholarship motivations and portfolios.',
      icon: Award,
    },
    {
      title: 'Documentation Support',
      desc: 'Notary coordination, translation auditing, academic evaluations alignment, and Statement of Purpose (SOP) structural guidelines. We also assist with NOC (No Objection Certificate) applications for Nepalese students.',
      icon: Briefcase,
    },
    {
      title: 'Financial & Loan Guidance',
      desc: 'Assistance with bank balance certificates, property valuations, and education loan processing through recognized financial institutions in Nepal.',
      icon: FileCheck,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <ScrollReveal direction="up" delay={0.1}>
          <span className="text-brand-gold font-bold uppercase tracking-wider text-xs">Advisory Specialties</span>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-brand-blue-deep mt-2 mb-4">Our Premium Consulting Services</h1>
          <p className="text-brand-slate-light leading-relaxed">
            EduConsult Pro provides comprehensive, boutique advisory coverage at every stage of your international academic pipeline.
          </p>
        </ScrollReveal>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {services.map((service, index) => (
          <ScrollReveal key={service.title} direction="up" delay={index * 0.08}>
            <GlassCard className="h-full hover-gold-grow flex flex-col justify-between">
              <div>
                <div className="p-3 bg-brand-blue-deep/5 text-brand-blue-deep w-fit rounded-xl mb-6 border border-brand-indigo-light/10">
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-brand-blue-deep mb-3 font-sans">{service.title}</h3>
                <p className="text-sm text-brand-slate-light leading-relaxed mb-6">{service.desc}</p>
              </div>
            </GlassCard>
          </ScrollReveal>
        ))}
      </div>

      {/* CTA Box */}
      <ScrollReveal direction="up" delay={0.2}>
        <div className="bg-brand-slate text-white rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10 max-w-xl">
            <h2 className="text-3xl font-serif font-bold text-brand-gold-light mb-4">Ready to outline your overseas pathway?</h2>
            <p className="text-sm text-brand-slate-light leading-relaxed">
              Book a detailed counseling call. Our Founder, Saksham Prasai, will analyze your qualifications, budget parameters, and visa viability.
            </p>
          </div>
          <div className="relative z-10 flex-shrink-0">
            <Link
              href="/appointments"
              className="px-8 py-4 bg-brand-gold hover:bg-brand-gold-dark text-brand-slate font-semibold rounded-full hover:shadow-gold transition-all duration-300 flex items-center gap-2"
            >
              <span>Schedule Initial Assessment</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </ScrollReveal>

    </div>
  );
}
