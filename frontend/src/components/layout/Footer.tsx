'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Mail, Phone, MapPin, Send, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-slate text-white pt-20 pb-10 relative overflow-hidden border-t border-brand-indigo-dark/10">
      
      {/* Background design elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-indigo/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-brand-gold" />
              <span className="font-serif text-2xl font-bold tracking-tight">
                EduConsult<span className="text-brand-gold">Pro</span>
              </span>
            </Link>
            <p className="text-sm text-brand-slate-light leading-relaxed">
              Crafting premium pathways for global education. We guide aspiring minds towards world-renowned institutions with precision, luxury, and care.
            </p>
            <div className="flex gap-4">
              <a href="#" className="h-10 w-10 rounded-full border border-white/10 hover:border-brand-gold hover:text-brand-gold flex items-center justify-center transition-all duration-300">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full border border-white/10 hover:border-brand-gold hover:text-brand-gold flex items-center justify-center transition-all duration-300">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full border border-white/10 hover:border-brand-gold hover:text-brand-gold flex items-center justify-center transition-all duration-300">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full border border-white/10 hover:border-brand-gold hover:text-brand-gold flex items-center justify-center transition-all duration-300">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <h4 className="font-serif text-lg font-bold tracking-wide text-brand-gold">Services</h4>
            <div className="flex flex-col gap-3">
              <Link href="/services" className="text-sm text-brand-slate-light hover:text-brand-gold transition-colors duration-300">Student Visa Consulting</Link>
              <Link href="/services" className="text-sm text-brand-slate-light hover:text-brand-gold transition-colors duration-300">Study Abroad Programs</Link>
              <Link href="/services" className="text-sm text-brand-slate-light hover:text-brand-gold transition-colors duration-300">Admission Assistance</Link>
              <Link href="/services" className="text-sm text-brand-slate-light hover:text-brand-gold transition-colors duration-300">Scholarship Support</Link>
              <Link href="/services" className="text-sm text-brand-slate-light hover:text-brand-gold transition-colors duration-300">Language Prep</Link>
            </div>
          </div>

          {/* Countries */}
          <div className="flex flex-col gap-6">
            <h4 className="font-serif text-lg font-bold tracking-wide text-brand-gold">Study Destinations</h4>
            <div className="flex flex-col gap-3 col-span-2">
              <Link href="/countries/canada" className="text-sm text-brand-slate-light hover:text-brand-gold transition-colors duration-300">Study in Canada</Link>
              <Link href="/countries/australia" className="text-sm text-brand-slate-light hover:text-brand-gold transition-colors duration-300">Study in Australia</Link>
              <Link href="/countries/united-kingdom" className="text-sm text-brand-slate-light hover:text-brand-gold transition-colors duration-300">Study in the United Kingdom</Link>
              <Link href="/countries/united-states" className="text-sm text-brand-slate-light hover:text-brand-gold transition-colors duration-300">Study in the United States</Link>
              <Link href="/countries/germany" className="text-sm text-brand-slate-light hover:text-brand-gold transition-colors duration-300">Study in Germany</Link>
            </div>
          </div>

          {/* Newsletter / Contact Card */}
          <div className="flex flex-col gap-6">
            <h4 className="font-serif text-lg font-bold tracking-wide text-brand-gold">Stay Connected</h4>
            <p className="text-sm text-brand-slate-light">Subscribe to get study abroad visa updates and direct admission timelines.</p>
            
            <form onSubmit={handleSubscribe} className="flex relative">
              <input
                type="email"
                placeholder="Your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors pr-12"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 h-9 w-9 bg-brand-gold hover:bg-brand-gold-dark text-brand-slate flex items-center justify-center rounded-full transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            {subscribed && (
              <p className="text-xs text-brand-gold">Successfully subscribed! Thank you.</p>
            )}

            <div className="flex flex-col gap-3 text-sm text-brand-slate-light border-t border-white/5 pt-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-brand-gold flex-shrink-0" />
                <span>+977 9802481462</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-gold flex-shrink-0" />
                <span>saksham@educonsultpro.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-gold flex-shrink-0" />
                <span>Gatthaghar, Madhyapur Thimi, Bhaktapur, Nepal</span>
              </div>
            </div>

          </div>

        </div>

        {/* Separator line */}
        <hr className="border-white/10 mb-8" />

        {/* Bottom Panel */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-brand-slate-light">
            &copy; {currentYear} EduConsult Pro. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-brand-slate-light">
            <Link href="/privacy" className="hover:text-brand-gold transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-gold transition-colors">Terms of Service</Link>
            <Link href="/faq" className="hover:text-brand-gold transition-colors">FAQs</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
