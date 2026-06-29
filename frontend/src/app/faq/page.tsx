'use client';

import React, { useState } from 'react';
import ScrollReveal from '../../components/animations/ScrollReveal';
import GlassCard from '../../components/ui/GlassCard';
import { HelpCircle, ChevronDown } from 'lucide-react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How long does the study visa permit process take?',
      a: 'Visa timelines vary by country. Canada SDS applications are usually processed in 4-6 weeks, whereas Australia Subclass 500 can take between 2-8 weeks. We recommend starting your dossier preparation 6 months before the academic intake starts.',
    },
    {
      q: 'What is a GIC block account and is it mandatory for Canada?',
      a: 'A Guaranteed Investment Certificate (GIC) is an investment account holding proof of funds for student living costs. For the Canadian SDS pathway, a GIC of $20,635 CAD from an approved bank is mandatory. Once in Canada, you get an initial lump-sum followed by monthly disbursements to cover food and housing.',
    },
    {
      q: 'What language tests does EduConsult Pro prepare for?',
      a: 'We offer intensive preparation materials, expert guides, and mock testing slots for IELTS Academic, TOEFL iBT, and PTE Academic. We also advise on GMAT and GRE score distributions.',
    },
    {
      q: 'Can I study abroad without taking an IELTS test?',
      a: 'Some universities in the UK and USA offer IELTS waivers if your high school instruction was fully in English, or if you take their specific internal ESL tests. However, standard visa streams (like Canada SDS) generally require independent IELTS/TOEFL scores to ensure fast processing.',
    },
    {
      q: 'Do you charge student fees upfront for counseling?',
      a: 'Our initial evaluation and counseling call is 100% free. Once you choose to register for university pitching and visa document filing, we charge transparent, tier-based package fees depending on your target destinations and scholarship requirements.',
    },
  ];

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <ScrollReveal direction="up" delay={0.1}>
          <span className="text-brand-gold font-bold uppercase tracking-wider text-xs">Support Center</span>
          <h1 className="text-4xl font-serif font-bold text-brand-blue-deep mt-2 mb-4">Frequently Asked Questions</h1>
          <p className="text-sm text-brand-slate-light leading-relaxed">
            Get answers to standard questions regarding study permits, language scoring, and financial blockage.
          </p>
        </ScrollReveal>
      </div>

      {/* Accordions */}
      <div className="flex flex-col gap-4 mb-20">
        {faqs.map((faq, index) => (
          <ScrollReveal key={index} direction="up" delay={index * 0.05}>
            <div 
              onClick={() => toggleIndex(index)}
              className="glass rounded-2xl p-5 border border-brand-indigo-light/10 hover:border-brand-gold/30 hover:shadow-sm cursor-pointer transition-all"
            >
              <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-brand-gold flex-shrink-0" />
                  <h3 className="font-semibold text-brand-slate text-sm font-sans">{faq.q}</h3>
                </div>
                <ChevronDown className={`h-5 w-5 text-brand-slate-light transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
              </div>
              {openIndex === index && (
                <div className="mt-4 pt-4 border-t border-brand-slate-light/5 text-xs text-brand-slate-light leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>

    </div>
  );
}
