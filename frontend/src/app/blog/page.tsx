'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '../../lib/api';
import GlassCard from '../../components/ui/GlassCard';
import ScrollReveal from '../../components/animations/ScrollReveal';
import { Search, Calendar, Eye, User, ArrowRight } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  category: string;
  views: number;
  createdAt: string;
}

function BlogContent() {
  const searchParams = useSearchParams();

  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');

  // Static Fallbacks
  const staticBlogs: BlogPost[] = [
    {
      id: '1',
      title: 'How to Write a Winning Statement of Purpose (SOP)',
      slug: 'how-to-write-winning-sop',
      excerpt: 'Learn the key strategies, paragraph structures, and mistakes to avoid when drafting your SOP for university admissions.',
      coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
      category: 'University Admissions',
      views: 145,
      createdAt: '2026-06-12T10:00:00.000Z',
    },
    {
      id: '2',
      title: 'Understanding the Canada Study Permit GIC Requirements',
      slug: 'canada-study-permit-gic-requirements',
      excerpt: 'Everything you need to know about the Guaranteed Investment Certificate (GIC) cost of living update.',
      coverImage: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80',
      category: 'Visa Regulations',
      views: 92,
      createdAt: '2026-06-10T08:30:00.000Z',
    },
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (categoryFilter) queryParams.append('category', categoryFilter);

        const res = await api.get(`/blog?${queryParams.toString()}`);
        setBlogs(res.data.data.blogs);
      } catch (err) {
        console.log('Using static fallback for blogs list...');
        let filtered = [...staticBlogs];
        if (search) {
          filtered = filtered.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.excerpt.toLowerCase().includes(search.toLowerCase()));
        }
        if (categoryFilter) {
          filtered = filtered.filter(b => b.category.toLowerCase() === categoryFilter.toLowerCase());
        }
        setBlogs(filtered);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [search, categoryFilter]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <ScrollReveal direction="up" delay={0.1}>
          <span className="text-brand-gold font-bold uppercase tracking-wider text-xs">Knowledge Center</span>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-brand-blue-deep mt-2 mb-4">EduConsult Pro Blog</h1>
          <p className="text-brand-slate-light leading-relaxed">
            Stay informed with guides written by our senior educational advisors, covering student visas, exam prep, and college updates.
          </p>
        </ScrollReveal>
      </div>

      {/* Filter panel */}
      <ScrollReveal direction="up" delay={0.2} className="mb-12">
        <GlassCard className="p-4 md:p-6 shadow-sm border border-brand-indigo-light/5">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            
            {/* Search Input */}
            <div className="flex-1 w-full relative">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-brand-slate-light" />
              <input
                type="text"
                placeholder="Search blog title or content..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-xl pl-10 pr-4 py-3 text-sm text-brand-slate"
              />
            </div>

            {/* Category Selector */}
            <div className="w-full md:w-64 relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-xl px-4 py-3 text-sm text-brand-slate appearance-none cursor-pointer"
              >
                <option value="">All Categories</option>
                <option value="University Admissions">University Admissions</option>
                <option value="Visa Regulations">Visa Regulations</option>
                <option value="Study Abroad Tips">Study Abroad Tips</option>
              </select>
              <ArrowRight className="absolute right-4 top-3.5 h-4 w-4 text-brand-slate-light pointer-events-none rotate-90" />
            </div>

          </div>
        </GlassCard>
      </ScrollReveal>

      {/* Blog Grid */}
      {loading ? (
        <div className="text-center py-20">
          <p className="text-brand-slate-light font-semibold">Loading blogs...</p>
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {blogs.map((blog, idx) => (
            <ScrollReveal key={blog.id} direction="up" delay={idx * 0.05}>
              <Link href={`/blog/${blog.slug}`} className="group block h-full">
                <GlassCard className="p-0 overflow-hidden flex flex-col border border-brand-indigo-light/10 h-full hover-gold-grow">
                  
                  {/* Image wrapper */}
                  <div className="h-48 relative overflow-hidden flex-shrink-0">
                    {blog.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute top-4 left-4 bg-brand-blue-deep text-brand-gold-light text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      {blog.category}
                    </div>
                  </div>

                  {/* Text wrapper */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex gap-4 text-[10px] text-brand-slate-light mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{new Date(blog.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          <span>{blog.views} views</span>
                        </span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-brand-blue-deep leading-snug mb-3 group-hover:text-brand-indigo transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-xs text-brand-slate-light leading-relaxed mb-6 line-clamp-3">
                        {blog.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-brand-indigo font-bold text-xs group-hover:text-brand-gold transition-colors self-start">
                      <span>Read Article</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                </GlassCard>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-brand-indigo-light/20 rounded-2xl bg-brand-blue-deep/5">
          <p className="text-brand-slate font-semibold">No articles found matching your criteria.</p>
          <button
            onClick={() => {
              setSearch('');
              setCategoryFilter('');
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

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="text-brand-slate-light font-semibold">Loading article feeds...</p>
      </div>
    }>
      <BlogContent />
    </Suspense>
  );
}
