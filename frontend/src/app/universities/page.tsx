'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '../../lib/api';
import GlassCard from '../../components/ui/GlassCard';
import ScrollReveal from '../../components/animations/ScrollReveal';
import { Search, Globe, Award, ArrowUpRight, GraduationCap } from 'lucide-react';

interface University {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string | null;
  image: string | null;
  website: string | null;
  ranking: number | null;
  courses: string[];
  requirements: string;
  country: {
    name: string;
  };
}

function UniversitiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [countryFilter, setCountryFilter] = useState(searchParams.get('country') || '');

  // Static Fallbacks
  const staticUniversities: University[] = [
    {
      id: '1',
      name: 'University of Toronto',
      slug: 'university-of-toronto',
      description: 'Ranked among the top universities globally, U of T is Canada’s leading research institution, offering diverse courses in Toronto, Ontario.',
      logo: null,
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
      website: 'https://www.utoronto.ca',
      ranking: 21,
      courses: ['Computer Science', 'Engineering', 'MBA', 'Medicine'],
      requirements: 'GPA 3.7+ (85%+), IELTS 7.0 or TOEFL 100+.',
      country: { name: 'Canada' },
    },
    {
      id: '2',
      name: 'University of Melbourne',
      slug: 'university-of-melbourne',
      description: 'Australia’s top research university located in the cultural capital of Melbourne, known for its high-impact research output.',
      logo: null,
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80',
      website: 'https://www.unimelb.edu.au',
      ranking: 14,
      courses: ['Information Technology', 'Civil Engineering', 'Finance', 'Law'],
      requirements: 'First-class honours degree or GPA 3.3+, IELTS 6.5.',
      country: { name: 'Australia' },
    },
    {
      id: '3',
      name: 'University of Oxford',
      slug: 'university-of-oxford',
      description: 'The oldest university in the English-speaking world, offering world-class collegiate tutorials and rich academic tradition.',
      logo: null,
      image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80',
      website: 'https://www.ox.ac.uk',
      ranking: 3,
      courses: ['Philosophy', 'Computer Science', 'Economics', 'Biosciences'],
      requirements: 'A*A*A* at A-levels, GPA 3.9+, IELTS 7.5.',
      country: { name: 'United Kingdom' },
    },
    {
      id: '4',
      name: 'Massachusetts Institute of Technology (MIT)',
      slug: 'mit',
      description: 'Located in Cambridge, Massachusetts, MIT is a world leader in scientific and technological research and education.',
      logo: null,
      image: 'https://images.unsplash.com/photo-1622397333309-3056849bc70b?auto=format&fit=crop&w=600&q=80',
      website: 'https://www.mit.edu',
      ranking: 1,
      courses: ['Computer Science & AI', 'Mechanical Engineering', 'Physics', 'Finance'],
      requirements: 'Near-perfect academic scores, SAT/ACT, IELTS 7.5+.',
      country: { name: 'United States' },
    },
  ];

  useEffect(() => {
    const fetchUnis = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (countryFilter) queryParams.append('country', countryFilter);

        const res = await api.get(`/universities?${queryParams.toString()}`);
        setUniversities(res.data.data.universities);
      } catch (err) {
        console.log('Using static fallback for universities list...');
        // Filter static list locally based on inputs
        let filtered = [...staticUniversities];
        if (search) {
          filtered = filtered.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));
        }
        if (countryFilter) {
          filtered = filtered.filter(u => u.country.name.toLowerCase() === countryFilter.toLowerCase());
        }
        setUniversities(filtered);
      } finally {
        setLoading(false);
      }
    };

    fetchUnis();
  }, [search, countryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <ScrollReveal direction="up" delay={0.1}>
          <span className="text-brand-gold font-bold uppercase tracking-wider text-xs">University Directories</span>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-brand-blue-deep mt-2 mb-4">Partner Institutions</h1>
          <p className="text-brand-slate-light leading-relaxed">
            Search through our vetted listing of partner universities offering global courses and graduate streams.
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
                placeholder="Search university name..."
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

      {/* Registry Grid */}
      {loading ? (
        <div className="text-center py-20">
          <p className="text-brand-slate-light font-semibold">Loading school list...</p>
        </div>
      ) : universities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {universities.map((uni, idx) => (
            <ScrollReveal key={uni.id} direction="up" delay={idx * 0.05}>
              <GlassCard className="p-0 overflow-hidden flex flex-col md:flex-row border border-brand-indigo-light/10 h-full hover-gold-grow">
                {/* Image panel */}
                <div className="w-full md:w-48 h-48 md:h-auto relative flex-shrink-0">
                  {uni.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={uni.image}
                      alt={uni.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-brand-blue-deep/20" />
                </div>

                {/* Info panel */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">{uni.country.name}</span>
                      {uni.ranking && (
                        <span className="text-[10px] bg-brand-gold/10 px-2 py-0.5 rounded-full text-brand-gold-dark font-semibold flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          <span>Rank #{uni.ranking}</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-xl font-bold text-brand-blue-deep mb-3">{uni.name}</h3>
                    <p className="text-xs text-brand-slate-light leading-relaxed mb-4 line-clamp-3">
                      {uni.description}
                    </p>

                    {/* Courses */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {uni.courses.map((course) => (
                        <span key={course} className="text-[10px] bg-brand-blue-deep/5 px-2 py-0.5 rounded text-brand-blue-deep font-medium">
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-brand-slate-light/5 pt-4">
                    <span className="text-[10px] text-brand-slate-light">Entry: {uni.requirements.split(',')[0]}</span>
                    {uni.website && (
                      <a
                        href={uni.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-brand-indigo font-bold hover:text-brand-gold flex items-center gap-0.5"
                      >
                        <span>Website</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-brand-indigo-light/20 rounded-2xl bg-brand-blue-deep/5">
          <p className="text-brand-slate font-semibold">No universities match your search criteria.</p>
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

export default function UniversitiesPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="text-brand-slate-light font-semibold">Loading university lists...</p>
      </div>
    }>
      <UniversitiesContent />
    </Suspense>
  );
}
