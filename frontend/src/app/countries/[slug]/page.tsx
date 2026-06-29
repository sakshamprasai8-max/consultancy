'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import api from '../../../lib/api';
import GlassCard from '../../../components/ui/GlassCard';
import ScrollReveal from '../../../components/animations/ScrollReveal';
import { 
  Building2, 
  FileCheck2, 
  CreditCard, 
  MapPin, 
  ExternalLink,
  ChevronLeft,
  GraduationCap
} from 'lucide-react';

interface University {
  id: string;
  name: string;
  slug: string;
  ranking: number | null;
  courses: string[];
}

interface Country {
  name: string;
  slug: string;
  description: string;
  requirements: string;
  visas: string;
  image: string | null;
  universities: University[];
}

export default function CountryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);

  // Fallback static data in case backend is loading/unseeded
  const staticFallbacks: Record<string, Country> = {
    canada: {
      name: 'Canada',
      slug: 'canada',
      description: 'Canada is globally recognized for its high academic standards, diverse communities, and post-study work opportunities.',
      requirements: 'Academic transcripts, proof of language proficiency (IELTS 6.5+ or equivalent), Statement of Purpose, and letters of recommendation.',
      visas: 'Study Permit (IRCC validation). Requires a Letter of Acceptance (LOA), proof of financial support (GIC of $20,635 CAD + tuition fee), and medical clearance.',
      image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=1200&q=80',
      universities: [
        { id: '1', name: 'University of Toronto', slug: 'university-of-toronto', ranking: 21, courses: ['Computer Science', 'Engineering', 'MBA'] }
      ]
    },
    australia: {
      name: 'Australia',
      slug: 'australia',
      description: 'Australia offers world-class education, vibrant city life, and excellent post-study work streams under the subclass 500 visa.',
      requirements: 'Academic qualifications, English score (IELTS 6.0+), Genuine Student (GS) statement, and Overseas Student Health Cover (OSHC).',
      visas: 'Student Visa (Subclass 500). Requires Confirmation of Enrolment (CoE), proof of financial capacity ($24,505 AUD/year), and OSHC.',
      image: 'https://images.unsplash.com/photo-1523482596682-cd93a6e54520?auto=format&fit=crop&w=1200&q=80',
      universities: [
        { id: '2', name: 'University of Melbourne', slug: 'university-of-melbourne', ranking: 14, courses: ['Information Technology', 'Civil Engineering', 'Finance'] }
      ]
    },
    'united-kingdom': {
      name: 'United Kingdom',
      slug: 'united-kingdom',
      description: 'Home to historic academic institutions, the UK provides intensive, world-renowned degrees and a 2-year Graduate Route visa.',
      requirements: 'Academic certificates, IELTS Academic (6.0+), Reference letters, and personal statement.',
      visas: 'Student Visa. Requires Confirmation of Acceptance for Studies (CAS), proof of financial resources (£1,334/month in London), and healthcare surcharge (IHS).',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
      universities: [
        { id: '3', name: 'University of Oxford', slug: 'university-of-oxford', ranking: 3, courses: ['Philosophy', 'Economics', 'Biosciences'] }
      ]
    },
    'united-states': {
      name: 'United States',
      slug: 'united-states',
      description: 'The USA offers the most diverse research universities and campus experiences, with OPT opportunities for STEM graduates.',
      requirements: 'Transcripts, Standardized tests (SAT/ACT/GRE/GMAT), English proficiency, Recommendation letters, and financial affidavits.',
      visas: 'F-1 Student Visa. Requires Form I-20 issued by an approved SEVP institution, SEVIS fee payment, and an embassy visa interview.',
      image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=1200&q=80',
      universities: [
        { id: '4', name: 'Massachusetts Institute of Technology (MIT)', slug: 'mit', ranking: 1, courses: ['Computer Science & AI', 'Physics', 'Finance'] }
      ]
    }
  };

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const res = await api.get(`/countries/${slug}`);
        setCountry(res.data.data);
      } catch (err) {
        console.log('Using static fallback for country details...');
        if (staticFallbacks[slug]) {
          setCountry(staticFallbacks[slug]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCountryData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="text-brand-slate-light font-semibold">Loading destination guidelines...</p>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center flex flex-col items-center gap-4">
        <h2 className="text-2xl font-serif font-bold text-brand-blue-deep">Destination Not Supported</h2>
        <p className="text-brand-slate-light">We currently do not offer advisory services for this country.</p>
        <Link href="/countries" className="text-brand-indigo font-bold hover:underline flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Countries</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      
      {/* Hero Header */}
      <div className="relative h-96 bg-brand-slate overflow-hidden">
        {country.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={country.image}
            alt={country.name}
            className="w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
        <div className="absolute bottom-10 left-6 max-w-7xl mx-auto w-full px-6 text-brand-blue-deep z-10">
          <Link href="/countries" className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-indigo hover:text-brand-gold mb-3 transition-colors">
            <ChevronLeft className="h-4 w-4" />
            <span>Destinations</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-2">{country.name} Study Guidelines</h1>
          <p className="max-w-xl text-sm md:text-base text-brand-slate-light">{country.description}</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Visa and Admission details */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          
          <ScrollReveal direction="up" delay={0.1}>
            <GlassCard>
              <h2 className="text-2xl font-serif font-bold text-brand-blue-deep flex items-center gap-2 border-b border-brand-indigo-light/10 pb-4 mb-6">
                <FileCheck2 className="h-6 w-6 text-brand-gold" />
                <span>Admission Prerequisites</span>
              </h2>
              <div className="text-sm text-brand-slate-light leading-relaxed whitespace-pre-line">
                {country.requirements}
              </div>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <GlassCard>
              <h2 className="text-2xl font-serif font-bold text-brand-blue-deep flex items-center gap-2 border-b border-brand-indigo-light/10 pb-4 mb-6">
                <CreditCard className="h-6 w-6 text-brand-gold" />
                <span>Student Visa & Living Costs</span>
              </h2>
              <div className="text-sm text-brand-slate-light leading-relaxed whitespace-pre-line">
                {country.visas}
              </div>
            </GlassCard>
          </ScrollReveal>

        </div>

        {/* Partner Universities Sidebar */}
        <div className="flex flex-col gap-6">
          <ScrollReveal direction="up" delay={0.3}>
            <div className="glass rounded-2xl p-6 border border-brand-indigo-light/10">
              <h3 className="text-lg font-serif font-bold text-brand-blue-deep border-b border-brand-indigo-light/10 pb-3 mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-brand-gold" />
                <span>Featured Universities</span>
              </h3>
              
              {country.universities && country.universities.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {country.universities.map((uni) => (
                    <div key={uni.id} className="border-b border-brand-slate-light/5 pb-3 last:border-0 last:pb-0">
                      <h4 className="text-sm font-semibold text-brand-slate hover:text-brand-gold transition-colors">
                        <Link href={`/universities?search=${encodeURIComponent(uni.name)}`}>
                          {uni.name}
                        </Link>
                      </h4>
                      {uni.ranking && <p className="text-xs text-brand-slate-light mt-1">World Rank: #{uni.ranking}</p>}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {uni.courses.slice(0, 3).map((c) => (
                          <span key={c} className="text-[10px] bg-brand-blue-deep/5 px-2 py-0.5 rounded text-brand-blue-deep">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-brand-slate-light">No specific universities listed. Contact us for the complete directory.</p>
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4}>
            <div className="bg-brand-slate text-white rounded-2xl p-6 border border-brand-indigo-dark/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-[40px] pointer-events-none" />
              <div className="relative z-10">
                <h3 className="font-serif text-lg font-bold text-brand-gold-light mb-3">Study in {country.name}</h3>
                <p className="text-xs text-brand-slate-light leading-relaxed mb-6">
                  Get a complete visa assessment. We assist in GIC blocked accounts, drafting statement of purpose, and university matching.
                </p>
                <Link
                  href="/appointments"
                  className="block text-center py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-brand-slate font-semibold text-xs rounded-full shadow transition-all duration-300"
                >
                  Schedule Free Assessment
                </Link>
              </div>
            </div>
          </ScrollReveal>

        </div>

      </div>

    </div>
  );
}
