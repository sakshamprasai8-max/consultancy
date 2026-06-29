'use client';

import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { useAuth } from '../../providers/AuthProvider';
import GlassCard from '../../components/ui/GlassCard';
import ScrollReveal from '../../components/animations/ScrollReveal';
import { Star, Quote, MessageSquare, Check } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  universityName: string | null;
  countryName: string | null;
  program: string | null;
  createdAt: string;
  student: {
    firstName: string;
    lastName: string;
  };
}

export default function ReviewsPage() {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Review submission state
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    content: '',
    universityName: '',
    countryName: '',
    program: '',
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Static Fallbacks
  const staticReviews: Review[] = [
    {
      id: '1',
      rating: 5,
      title: 'Flawless Visa Support',
      content: 'EduConsult Pro made my Canadian study permit application look simple. Arthur guided me closely through the GIC process and reviewed my transcripts line-by-line. Highly professional!',
      universityName: 'University of Toronto',
      countryName: 'Canada',
      program: 'M.S. in Computer Science',
      createdAt: '2026-06-12T10:00:00.000Z',
      student: { firstName: 'Julian', lastName: 'Everhart' },
    },
    {
      id: '2',
      rating: 5,
      title: 'Top Tier Placement Advisory',
      content: 'I was lost with college essays and recommendation choices. Saksham Prasai helped refine my CV format, pitch to Melbourne, and apply for scholarships. Excellent and highly recommended.',
      universityName: 'University of Melbourne',
      countryName: 'Australia',
      program: 'Master of Information Technology',
      createdAt: '2026-06-08T14:20:00.000Z',
      student: { firstName: 'Samantha', lastName: 'Miller' },
    },
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/reviews');
        setReviews(res.data.data);
      } catch (err) {
        console.log('Using static fallback for reviews list...');
        setReviews(staticReviews);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      await api.post('/reviews', {
        ...formData,
        rating: Number(formData.rating),
      });
      setSubmitSuccess(true);
      setFormData({
        rating: 5,
        title: '',
        content: '',
        universityName: '',
        countryName: '',
        program: '',
      });
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <ScrollReveal direction="up" delay={0.1}>
          <span className="text-brand-gold font-bold uppercase tracking-wider text-xs">Client Feedbacks</span>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-brand-blue-deep mt-2 mb-4">Student Testimonials & Reviews</h1>
          <p className="text-brand-slate-light leading-relaxed">
            Read transparent comments from students placed in top universities across Canada, UK, and Australia.
          </p>
        </ScrollReveal>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
        
        {/* Reviews Grid */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-brand-slate-light font-semibold">Loading reviews...</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((rev, idx) => (
                <ScrollReveal key={rev.id} direction="up" delay={idx * 0.05}>
                  <GlassCard className="h-full flex flex-col justify-between p-6">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <Quote className="h-8 w-8 text-brand-gold/20 flex-shrink-0" />
                        <div className="flex text-brand-gold">
                          {Array.from({ length: rev.rating }).map((_, starIdx) => (
                            <Star key={starIdx} className="h-4.5 w-4.5 fill-brand-gold" />
                          ))}
                        </div>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-brand-blue-deep mb-2">{rev.title}</h4>
                      <p className="text-xs text-brand-slate-light leading-relaxed mb-6 italic">
                        "{rev.content}"
                      </p>
                    </div>

                    <div className="border-t border-brand-slate-light/5 pt-4">
                      <p className="text-xs font-bold text-brand-blue-deep">{rev.student.firstName} {rev.student.lastName}</p>
                      {rev.universityName && (
                        <p className="text-[10px] text-brand-slate-light mt-0.5">
                          Placed: {rev.universityName} ({rev.countryName})
                        </p>
                      )}
                    </div>
                  </GlassCard>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-brand-indigo-light/20 rounded-2xl">
              <p className="text-brand-slate font-semibold">No reviews are currently posted.</p>
            </div>
          )}
        </div>

        {/* Submit Review Panel */}
        <div>
          <ScrollReveal direction="up" delay={0.25}>
            <div className="glass rounded-2xl p-6 border border-brand-indigo-light/10 shadow-md">
              <h3 className="font-serif text-xl font-bold text-brand-blue-deep border-b border-brand-indigo-light/10 pb-3 mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-brand-gold" />
                <span>Submit Feedback</span>
              </h3>

              {isAuthenticated ? (
                submitSuccess ? (
                  <div className="p-6 text-center flex flex-col items-center gap-2">
                    <Check className="h-10 w-10 text-green-500 bg-green-50 rounded-full p-2" />
                    <h4 className="font-semibold text-green-700">Thank you!</h4>
                    <p className="text-xs text-brand-slate-light">Your review was submitted and will appear after admin verification.</p>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-slate mb-1">Rating</label>
                      <select
                        name="rating"
                        value={formData.rating}
                        onChange={handleInputChange}
                        className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-lg px-3 py-2 text-xs text-brand-slate cursor-pointer"
                      >
                        <option value="5">5 Stars — Excellent</option>
                        <option value="4">4 Stars — Very Good</option>
                        <option value="3">3 Stars — Average</option>
                        <option value="2">2 Stars — Poor</option>
                        <option value="1">1 Star — Unacceptable</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-slate mb-1">Summary Title</label>
                      <input
                        type="text"
                        required
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Excellent Counseling, fast visa, etc."
                        className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-lg px-3 py-2 text-xs text-brand-slate"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-slate mb-1">Placement University (Optional)</label>
                      <input
                        type="text"
                        name="universityName"
                        value={formData.universityName}
                        onChange={handleInputChange}
                        placeholder="e.g. University of Toronto"
                        className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-lg px-3 py-2 text-xs text-brand-slate"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-slate mb-1">Placement Country (Optional)</label>
                      <input
                        type="text"
                        name="countryName"
                        value={formData.countryName}
                        onChange={handleInputChange}
                        placeholder="e.g. Canada"
                        className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-lg px-3 py-2 text-xs text-brand-slate"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-slate mb-1">Program / Degree (Optional)</label>
                      <input
                        type="text"
                        name="program"
                        value={formData.program}
                        onChange={handleInputChange}
                        placeholder="e.g. Master in CS"
                        className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-lg px-3 py-2 text-xs text-brand-slate"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-slate mb-1">Detailed Comment</label>
                      <textarea
                        required
                        name="content"
                        rows={4}
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="Detail your consulting journey..."
                        className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-lg px-3 py-2 text-xs text-brand-slate resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="w-full text-center py-2.5 bg-blue-gradient text-white text-xs font-semibold rounded-full shadow"
                    >
                      {submitLoading ? 'Submitting...' : 'Post Verification Review'}
                    </button>
                  </form>
                )
              ) : (
                <div className="py-6 text-center bg-brand-blue-deep/5 rounded-xl border border-brand-indigo-light/5">
                  <p className="text-xs text-brand-slate-light mb-4">Please log in to your student portal to post a review.</p>
                  <a
                    href="/contact?tab=login"
                    className="px-4 py-2 bg-brand-indigo hover:bg-brand-indigo-dark text-white font-semibold text-xs rounded-full inline-block shadow"
                  >
                    Log In Now
                  </a>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>

      </div>

    </div>
  );
}
