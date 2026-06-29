'use client';

import React from 'react';
import ScrollReveal from '../../components/animations/ScrollReveal';
import GlassCard from '../../components/ui/GlassCard';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-sm text-brand-slate-light leading-relaxed">
      
      <ScrollReveal direction="up" delay={0.1}>
        <h1 className="text-4xl font-serif font-bold text-brand-blue-deep mb-4">Terms & Conditions</h1>
        <p className="text-xs text-brand-slate-light mb-8">Last Updated: June 15, 2026</p>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.2}>
        <GlassCard className="p-8 border border-brand-indigo-light/10 flex flex-col gap-6">
          <section>
            <h2 className="text-xl font-serif font-bold text-brand-blue-deep mb-2">1. Scope of Counseling</h2>
            <p>
              EduConsult Pro offers academic placement advice, document format auditing, and visa advisory services. We do NOT guarantee university admissions offers or visa grants, as these remain the absolute discretion of their respective college boards and immigration bureaus.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-brand-blue-deep mb-2">2. Accuracy of Submitted Documents</h2>
            <p>
              Users are solely responsible for the authenticity of all transcripts, bank letters, and test scores uploaded to their student portal. Submission of fraudulent documents will result in immediate termination of the counseling contract and account closure without refunds.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-brand-blue-deep mb-2">3. Package Payments & Cancellation</h2>
            <p>
              Payments for specific dossier review packages must be settled according to invoice schedules. Cancellations made after document filing has commenced are subject to terms outlined in individual service agreement contracts. All transactions are governed by the laws of Nepal.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-brand-blue-deep mb-2">4. Legal Compliance</h2>
            <p>
              EduConsult Pro operates in compliance with the guidelines set by the Ministry of Education, Science and Technology of Nepal. We facilitate the acquisition of No Objection Certificates (NOC) but are not responsible for delays caused by government processing times.
            </p>
          </section>
        </GlassCard>
      </ScrollReveal>

    </div>
  );
}
