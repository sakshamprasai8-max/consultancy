'use client';

import React from 'react';
import Link from 'next/link';
import ScrollReveal from '../../components/animations/ScrollReveal';
import GlassCard from '../../components/ui/GlassCard';
import { ArrowRight, Landmark, FileText, Briefcase } from 'lucide-react';

export default function CountriesPage() {
  const destinations = [
    {
      name: 'Canada',
      slug: 'canada',
      desc: 'Top-tier research institutions, inclusive visa streams, and 3-year PGWP options.',
      image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Australia',
      slug: 'australia',
      desc: 'Exceptional group of eight universities, post-study work rights (Subclass 500), and sunshine.',
      image: 'https://images.unsplash.com/photo-1523482596682-cd93a6e54520?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'United Kingdom',
      slug: 'united-kingdom',
      desc: 'Historic colleges, 1-year Masters, and 2-year Graduate Route work permissions.',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'United States',
      slug: 'united-states',
      desc: 'Diverse research options, global industry links, and STEM OPT opportunities.',
      image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Germany',
      slug: 'germany',
      desc: 'Engineering leadership, zero tuition fees in public schools, and low living expenses.',
      image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <ScrollReveal direction="up" delay={0.1}>
          <span className="text-brand-gold font-bold uppercase tracking-wider text-xs">Global Education Hubs</span>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-brand-blue-deep mt-2 mb-4">Study Destinations We Serve</h1>
          <p className="text-brand-slate-light leading-relaxed">
            Select your target academic region to view detailed visa permits, block account conditions, and admissions criteria.
          </p>
        </ScrollReveal>
      </div>

      {/* Grid of Countries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {destinations.map((country, index) => (
          <ScrollReveal key={country.name} direction="up" delay={index * 0.1}>
            <Link href={`/countries/${country.slug}`} className="group block h-full">
              <GlassCard className="h-full flex flex-col p-0 overflow-hidden border border-brand-indigo-light/10 hover-gold-grow">
                {/* Image */}
                <div className="h-48 relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={country.image}
                    alt={country.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-blue-deep/60 to-transparent" />
                  <h3 className="absolute bottom-4 left-6 text-2xl font-serif font-bold text-white">{country.name}</h3>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <p className="text-sm text-brand-slate-light leading-relaxed mb-6">
                    {country.desc}
                  </p>
                  <div className="flex items-center gap-1.5 text-brand-indigo font-semibold text-sm hover:text-brand-gold transition-colors self-end">
                    <span>Explore Requirements</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </GlassCard>
            </Link>
          </ScrollReveal>
        ))}
      </div>

    </div>
  );
}
