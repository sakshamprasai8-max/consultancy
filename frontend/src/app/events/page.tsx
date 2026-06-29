'use client';

import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import GlassCard from '../../components/ui/GlassCard';
import ScrollReveal from '../../components/animations/ScrollReveal';
import { Calendar, MapPin, Video, Users, CheckCircle } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  dateTime: string;
  location: string;
  type: 'ONLINE' | 'IN_PERSON';
  image: string | null;
  capacity: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', phone: '' });
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  // Static Fallbacks
  const staticEvents: Event[] = [
    {
      id: '1',
      title: 'Global University Admission Virtual Fair',
      slug: 'global-university-admission-virtual-fair',
      description: 'Connect directly with admissions representatives from top universities in Canada, Australia, and the UK. Gain insights into intake requirements and scholarship eligibility.',
      dateTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Zoom Conference Link (Emailed upon registration)',
      type: 'ONLINE',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80',
      capacity: 300,
    },
    {
      id: '2',
      title: 'USA Student Visa Prep Seminar',
      slug: 'usa-student-visa-prep-seminar',
      description: 'Physical workshop covering standard F-1 visa interview questions, DS-160 forms, and financial sponsorship audits.',
      dateTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Main Auditorium, EduConsult Tower, Level 4',
      type: 'IN_PERSON',
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80',
      capacity: 50,
    },
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        setEvents(res.data.data);
      } catch (err) {
        console.log('Using static fallback for events list...');
        setEvents(staticEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setRegisterLoading(true);
    try {
      await api.post(`/events/${selectedEvent.id}/register`, registerForm);
      setRegisterSuccess(true);
      setRegisterForm({ name: '', email: '', phone: '' });
      setTimeout(() => {
        setRegisterSuccess(false);
        setSelectedEvent(null);
      }, 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to complete registration.');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <ScrollReveal direction="up" delay={0.1}>
          <span className="text-brand-gold font-bold uppercase tracking-wider text-xs">Seminars & Expos</span>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-brand-blue-deep mt-2 mb-4">Upcoming Information Events</h1>
          <p className="text-brand-slate-light leading-relaxed">
            Register for our exclusive virtual admissions fairs or live visa workshops to directly speak with advisors.
          </p>
        </ScrollReveal>
      </div>

      {/* Events listing */}
      {loading ? (
        <div className="text-center py-20">
          <p className="text-brand-slate-light font-semibold">Loading events schedule...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {events.map((event, idx) => (
            <ScrollReveal key={event.id} direction="up" delay={idx * 0.08}>
              <GlassCard className="p-0 overflow-hidden flex flex-col border border-brand-indigo-light/10 h-full hover-gold-grow">
                {/* Image */}
                <div className="h-56 relative overflow-hidden flex-shrink-0">
                  {event.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-brand-blue-deep/20" />
                  <div className="absolute top-4 left-4 bg-brand-gold text-brand-slate text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    {event.type}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-brand-blue-deep mb-3 leading-snug">{event.title}</h3>
                    <p className="text-xs text-brand-slate-light leading-relaxed mb-6">{event.description}</p>
                    
                    <div className="flex flex-col gap-2.5 text-xs text-brand-slate mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4.5 w-4.5 text-brand-gold" />
                        <span className="font-semibold">{new Date(event.dateTime).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {event.type === 'ONLINE' ? (
                          <Video className="h-4.5 w-4.5 text-brand-gold" />
                        ) : (
                          <MapPin className="h-4.5 w-4.5 text-brand-gold" />
                        )}
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4.5 w-4.5 text-brand-gold" />
                        <span>Max Capacity: {event.capacity} seats</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="w-full text-center py-3 bg-blue-gradient text-white text-xs font-semibold rounded-full shadow hover:shadow-gold transition-all duration-300"
                  >
                    Register Seat Now
                  </button>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-brand-indigo-light/20 rounded-2xl bg-brand-blue-deep/5">
          <p className="text-brand-slate font-semibold">No seminars scheduled at this time. Check back soon.</p>
        </div>
      )}

      {/* Register Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-brand-slate/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-brand-indigo-light/10 shadow-2xl glass relative">
            <h3 className="text-2xl font-serif font-bold text-brand-blue-deep mb-2">Event Registration</h3>
            <p className="text-xs text-brand-slate-light mb-6">Reserve your ticket for: <span className="font-semibold text-brand-blue-deep">{selectedEvent.title}</span></p>

            {registerSuccess ? (
              <div className="py-8 text-center flex flex-col items-center gap-2">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <h4 className="font-semibold text-green-700">Seat Reserved Successfully!</h4>
                <p className="text-xs text-brand-slate-light">Check your inbox for the confirmation ticket details.</p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-slate mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={registerForm.name}
                    onChange={handleRegisterInputChange}
                    placeholder="Enter your name"
                    className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-lg px-4 py-2.5 text-xs text-brand-slate"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-slate mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={registerForm.email}
                    onChange={handleRegisterInputChange}
                    placeholder="Enter your email"
                    className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-lg px-4 py-2.5 text-xs text-brand-slate"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-slate mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={registerForm.phone}
                    onChange={handleRegisterInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-lg px-4 py-2.5 text-xs text-brand-slate"
                  />
                </div>

                <div className="flex gap-4 mt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(null)}
                    className="flex-1 py-2.5 rounded-full border border-brand-indigo-light/25 text-brand-slate text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={registerLoading}
                    className="flex-1 py-2.5 bg-blue-gradient text-white text-xs font-semibold rounded-full shadow"
                  >
                    {registerLoading ? 'Processing...' : 'Confirm Ticket'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
