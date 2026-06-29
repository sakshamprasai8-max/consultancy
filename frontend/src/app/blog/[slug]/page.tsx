'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import api from '../../../lib/api';
import GlassCard from '../../../components/ui/GlassCard';
import ScrollReveal from '../../../components/animations/ScrollReveal';
import { Calendar, Eye, ArrowLeft, Tag, Share2 } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  category: string;
  tags: string[];
  views: number;
  createdAt: string;
}

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  // Static Fallback
  const staticFallbacks: Record<string, BlogPost> = {
    'how-to-write-winning-sop': {
      id: '1',
      title: 'How to Write a Winning Statement of Purpose (SOP)',
      slug: 'how-to-write-winning-sop',
      excerpt: 'Learn the key strategies, paragraph structures, and mistakes to avoid when drafting your SOP for university admissions.',
      content: `
        <p class="lead mb-6 text-lg font-serif italic text-brand-slate-light">Your Statement of Purpose is your primary tool to stand out among thousands of applicants. In this article, we outline the exact 5-paragraph model that top universities expect.</p>
        
        <h2 class="text-2xl font-serif font-bold text-brand-blue-deep mt-8 mb-4">1. The Introduction (The Hook)</h2>
        <p class="text-sm text-brand-slate-light leading-relaxed mb-6">Start with a powerful narrative about why you chose your field of study. Avoid generic introductions like "Since my childhood, I wanted to study computer science." Instead, talk about a specific project, query, or challenge that triggered your research interest.</p>

        <h2 class="text-2xl font-serif font-bold text-brand-blue-deep mt-8 mb-4">2. Academic Background & Milestones</h2>
        <p class="text-sm text-brand-slate-light leading-relaxed mb-6">Explain your undergraduate accomplishments, key subjects that shaped your research focus, projects, and internships. Don't just list what's on your CV; describe how these experiences built your academic framework.</p>

        <h2 class="text-2xl font-serif font-bold text-brand-blue-deep mt-8 mb-4">3. Why this Specific Program?</h2>
        <p class="text-sm text-brand-slate-light leading-relaxed mb-6">This is where most students fail. You must research the department, mention 1-2 professors whose work aligns with your goals, and refer to specific courses or lab structures in their curriculum. Show them you chose their school with intention.</p>
      `,
      coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
      category: 'University Admissions',
      tags: ['SOP', 'Admissions Tips', 'College Essay'],
      views: 146,
      createdAt: '2026-06-12T10:00:00.000Z',
    },
    'canada-study-permit-gic-requirements': {
      id: '2',
      title: 'Understanding the Canada Study Permit GIC Requirements',
      slug: 'canada-study-permit-gic-requirements',
      excerpt: 'Everything you need to know about the Guaranteed Investment Certificate (GIC) cost of living update.',
      content: `
        <p class="lead mb-6 text-lg font-serif italic text-brand-slate-light">Effective recently, Immigration, Refugees and Citizenship Canada (IRCC) updated the cost-of-living financial requirement for study permit applications. The new rate stands at $20,635 CAD.</p>
        <p class="text-sm text-brand-slate-light leading-relaxed mb-6">Guaranteed Investment Certificates (GIC) are a primary financial requirement for students applying under the Student Direct Stream (SDS) or non-SDS pathways. We outline how to fund your GIC block account and retrieve monthly disbursements once you arrive in Canada.</p>
      `,
      coverImage: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=1200&q=80',
      category: 'Visa Regulations',
      tags: ['Canada', 'GIC', 'Visa Updates', 'Finance'],
      views: 93,
      createdAt: '2026-06-10T08:30:00.000Z',
    }
  };

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const res = await api.get(`/blog/${slug}`);
        setBlog(res.data.data);
      } catch (err) {
        console.log('Using static fallback for blog detail...');
        if (staticFallbacks[slug]) {
          setBlog(staticFallbacks[slug]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="text-brand-slate-light font-semibold">Loading article...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center flex flex-col items-center gap-4">
        <h2 className="text-2xl font-serif font-bold text-brand-blue-deep">Article Not Found</h2>
        <p className="text-brand-slate-light">The requested article could not be loaded.</p>
        <Link href="/blog" className="text-brand-indigo font-bold hover:underline flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Blog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      
      {/* Back button */}
      <Link href="/blog" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-indigo hover:text-brand-gold mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Blog</span>
      </Link>

      <ScrollReveal direction="up" delay={0.1}>
        {/* Cover Image */}
        {blog.coverImage && (
          <div className="h-80 md:h-[400px] w-full rounded-3xl overflow-hidden mb-10 border border-brand-indigo-light/10 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-brand-slate-light/5">
          <div className="flex gap-4 text-xs text-brand-slate-light">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(blog.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{blog.views} views</span>
            </span>
          </div>

          <div className="flex gap-2">
            <span className="bg-brand-blue-deep/5 px-3 py-1 rounded-full text-xs text-brand-blue-deep font-semibold">
              {blog.category}
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-brand-blue-deep leading-tight mb-8">
          {blog.title}
        </h1>

        {/* Article Body */}
        <div 
          className="prose max-w-none text-brand-slate-light leading-relaxed mb-12"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Tags and share */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-6 border-t border-brand-slate-light/5">
          <div className="flex flex-wrap gap-2 items-center">
            <Tag className="h-4 w-4 text-brand-gold" />
            {blog.tags.map((tag) => (
              <span key={tag} className="text-xs bg-brand-slate-light/5 border border-brand-indigo-light/5 px-3 py-1 rounded-md text-brand-slate-light">
                #{tag}
              </span>
            ))}
          </div>
          <button 
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('Article link copied to clipboard!');
              }
            }}
            className="flex items-center gap-1 text-xs font-semibold text-brand-indigo hover:text-brand-gold"
          >
            <Share2 className="h-4 w-4" />
            <span>Share Article</span>
          </button>
        </div>

      </ScrollReveal>

    </div>
  );
}
