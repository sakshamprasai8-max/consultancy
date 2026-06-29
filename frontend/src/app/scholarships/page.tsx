'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '../../lib/api';
import GlassCard from '../../components/ui/GlassCard';
import ScrollReveal from '../../components/animations/ScrollReveal';
import { Search, Globe, DollarSign, Calendar, FileText } from 'lucide-react';

interface Scholarship {
  id: string;
  title: string;
  slug: string;
  description: string;
  amount: string;
  deadline: string;
  eligibility: string;
  country: {
    name: string;
  };
  university?: {
    name: string;
  } | null;
}

function ScholarshipsContent() {
  const searchParams = useSearchParams();

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [countryFilter, setCountryFilter] = useState(searchParams.get('country') || '');

  // Static Fallbacks
  const staticScholarships: Scholarship[] = [
    {
      id: '1',
      title: 'Lester B. Pearson International Scholarship',
      slug: 'lester-b-pearson-scholarship',
      description: 'The Lester B. Pearson International Scholarship Program at the University of Toronto provides an exceptional opportunity for outstanding international students to study at one of the world’s best universities.',
      amount: 'Full Tuition, Books, Incidental Fees, & Residence Support (4 years)',
      deadline: '2026-11-30',
      eligibility: 'Exceptional academic achievement, creative thinking, and demonstration of school leadership. Nominated by secondary school.',
      country: { name: 'Canada' },
      university: { name: 'University of Toronto' },
    },
    {
      id: '2',
      title: 'Melbourne International Undergraduate Scholarship',
      slug: 'melbourne-undergrad-scholarship',
      description: 'Awarded to high-achieving international students in recognition of their excellent academic results.',
      amount: '$10,000 tuition fee remission or 50% / 100% fee remission',
      deadline: '2026-12-15',
      eligibility: 'International student, enrolled in an undergraduate degree at University of Melbourne, top academic scores.',
      country: { name: 'Australia' },
      university: { name: 'University of Melbourne' },
    },
  ];

  useEffect(() => {
    const fetchScholarships = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (countryFilter) queryParams.append('country', countryFilter);

        const res = await api.get(`/scholarships?${queryParams.toString()}`);
        setScholarships(res.data.data);
      } catch (err) {
        console.log('Using static fallback for scholarships list...');
        let filtered = [...staticScholarships];
        if (search) {
          filtered = filtered.filter(s => s.title.toLowerCase().includes(search.toLowerCase()));
        }
        if (countryFilter) {
          filtered = filtered.filter(s => s.country.name.toLowerCase() === countryFilter.toLowerCase());
        }
        setScholarships(filtered);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, [search, countryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <ScrollReveal direction="up" delay={0.1}>
          <span className="text-brand-gold font-bold uppercase tracking-wider text-xs">Financial Support</span>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-brand-blue-deep mt-2 mb-4">Scholarships & Grants</h1>
          <p className="text-brand-slate-light leading-relaxed">
            Find active scholarship programs, international bursaries, and tuition waivers across our partner locations.
          </p>
        </ScrollReveal>
      </div>

      {/* Filter panel */}
      <ScrollReveal direction="up" delay={0.2} className="mb-12">
        <GlassCard className="p-4 md:p-6 shadow-sm border border-brand-indigo-light/5">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 items-center">
            
            {/* Search Input */}
            <div className="flex-1 w-full relative">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-brand-slate-light" />
              <input
                type="text"
                placeholder="Search scholarship title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-xl pl-10 pr-4 py-3 text-sm text-brand-slate"
              />
            </div>

            {/* Country Selector */}
            <div className="w-full md:w-64 relative">
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-xl px-4 py-3 text-sm text-brand-slate appearance-none cursor-pointer"
              >
                <option value="">All Countries</option>
                <option value="canada">Canada</option>
                <option value="australia">Australia</option>
                <option value="united-kingdom">United Kingdom</option>
                <option value="united-states">United States</option>
                <option value="germany">Germany</option>
              </select>
              <Globe className="absolute right-4 top-3.5 h-4 w-4 text-brand-slate-light pointer-events-none" />
            </div>

          </form>
        </GlassCard>
      </ScrollReveal>

      {/* Registry List */}
      {loading ? (
        <div className="text-center py-20">
          <p className="text-brand-slate-light font-semibold">Loading scholarships...</p>
        </div>
      ) : scholarships.length > 0 ? (
        <div className="flex flex-col gap-8 mb-20">
          {scholarships.map((sch, idx) => (
            <ScrollReveal key={sch.id} direction="up" delay={idx * 0.05}>
              <GlassCard className="border border-brand-indigo-light/10 hover-gold-grow">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6 pb-6 border-b border-brand-slate-light/5">
                  <div>
                    <div className="flex flex-wrap gap-2 items-center mb-2">
                      <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">{sch.country.name}</span>
                      {sch.university && (
                        <span className="text-[10px] bg-brand-blue-deep/5 px-2 py-0.5 rounded text-brand-blue-deep font-semibold">
                          {sch.university.name}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-brand-blue-deep">{sch.title}</h3>
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-brand-gold font-bold text-lg bg-brand-gold/10 px-4 py-2 rounded-xl">
                      <DollarSign className="h-5 w-5" />
                      <span>{sch.amount.split(' (')[0]}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-sm">
                  <div className="lg:col-span-2">
                    <h4 className="font-semibold text-brand-slate mb-2">Scholarship Description</h4>
                    <p className="text-brand-slate-light leading-relaxed mb-4 text-xs">
                      {sch.description}
                    </p>
                    <h4 className="font-semibold text-brand-slate mb-2">Eligibility Criteria</h4>
                    <p className="text-brand-slate-light leading-relaxed text-xs">
                      {sch.eligibility}
                    </p>
                  </div>

                  <div className="bg-brand-slate-light/5 p-6 rounded-2xl flex flex-col justify-between border border-brand-indigo-light/5">
                    <div>
                      <div className="flex items-center gap-2 text-brand-slate mb-4">
                        <Calendar className="h-5 w-5 text-brand-gold" />
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-brand-slate-light font-semibold">Application Deadline</p>
                          <p className="text-sm font-semibold">{new Date(sch.deadline).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-brand-slate">
                        <FileText className="h-5 w-5 text-brand-gold" />
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-brand-slate-light font-semibold font-sans">Support Type</p>
                          <p className="text-sm font-semibold">Institutional Grant</p>
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/appointments"
                      className="block text-center py-2.5 bg-blue-gradient text-white text-xs font-semibold rounded-full shadow hover:shadow-gold transition-all duration-300 mt-6"
                    >
                      Check Eligibility
                    </Link>
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-brand-indigo-light/20 rounded-2xl bg-brand-blue-deep/5">
          <p className="text-brand-slate font-semibold">No scholarships match your search criteria.</p>
          <button
            onClick={() => {
              setSearch('');
              setCountryFilter('');
            }}
            className="text-brand-indigo hover:text-brand-gold text-sm font-bold mt-2"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function ScholarshipsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="text-brand-slate-light font-semibold">Loading scholarship lists...</p>
      </div>
    }>
      <ScholarshipsContent />
    </Suspense>
  );
}
