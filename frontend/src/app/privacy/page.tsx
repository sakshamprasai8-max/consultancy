'use client';

import React from 'react';
import ScrollReveal from '../../components/animations/ScrollReveal';
import GlassCard from '../../components/ui/GlassCard';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-sm text-brand-slate-light leading-relaxed">
      
      <ScrollReveal direction="up" delay={0.1}>
        <h1 className="text-4xl font-serif font-bold text-brand-blue-deep mb-4">Privacy Policy</h1>
        <p className="text-xs text-brand-slate-light mb-8">Last Updated: June 15, 2026</p>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.2}>
        <GlassCard className="p-8 border border-brand-indigo-light/10 flex flex-col gap-6">
          <section>
            <h2 className="text-xl font-serif font-bold text-brand-blue-deep mb-2">1. Data We Collect</h2>
            <p>
              To offer university admissions advisory and document checkups, we collect user details such as name, email, phone coordinates, GPA indicators, transcript PDF files, passport numbers, and test certificates (IELTS/TOEFL).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-brand-blue-deep mb-2">2. How We Secure Files</h2>
            <p>
              Your academic records and personal details are encrypted and stored via secure databases and cloud parameters (Cloudinary). We limit file access strictly to assigned consultants and portal managers. We never sell or share files with third-party advertising brokers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-brand-blue-deep mb-2">3. Google Login</h2>
            <p>
              If you authenticate using Google SSO, we read your email and profile name details to register your student profile. You can revoke this credential access at any time through your Google Security Account settings panel.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-brand-blue-deep mb-2">4. Your Data Rights</h2>
            <p>
              You maintain the right to view, update, delete, or request export of all academic and profile records stored within our platform database. Please contact us at saksham@educonsultpro.com to process request queries.
            </p>
          </section>
        </GlassCard>
      </ScrollReveal>

    </div>
  );
}
