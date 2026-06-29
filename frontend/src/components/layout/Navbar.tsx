'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../providers/AuthProvider';
import { Menu, X, GraduationCap, User, LogOut, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Countries', href: '/countries' },
    { name: 'Universities', href: '/universities' },
    { name: 'Scholarships', href: '/scholarships' },
    { name: 'Blog', href: '/blog' },
    { name: 'Events', href: '/events' },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
    setShowDropdown(false);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass-nav shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" onClick={handleLinkClick}>
          <GraduationCap className="h-8 w-8 text-brand-gold group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-serif text-2xl font-bold tracking-tight text-brand-blue-deep group-hover:text-brand-indigo transition-colors duration-300">
            EduConsult<span className="text-brand-gold">Pro</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-brand-gold after:transition-all after:duration-300 hover:after:w-full hover:text-brand-blue-deep ${isActive(link.href) ? 'text-brand-blue-deep after:w-full font-semibold' : 'text-brand-slate-light'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* CTA / Auth Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-4 py-2 border border-brand-indigo-light/20 rounded-full bg-brand-blue-deep/5 text-brand-blue-deep hover:bg-brand-blue-deep/10 font-medium text-sm transition-all duration-300"
              >
                <User className="h-4 w-4" />
                <span>Hi, {user?.firstName}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-brand-indigo-light/10 rounded-xl shadow-lg py-2 z-50 glass">
                  <div className="px-4 py-2 border-b border-brand-slate-light/10 mb-1">
                    <p className="text-xs text-brand-slate-light">Role</p>
                    <p className="text-sm font-semibold text-brand-blue-deep">{user?.role}</p>
                  </div>
                  {user?.role === 'ADMIN' || user?.role === 'CONSULTANT' ? (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-sm text-brand-slate hover:bg-brand-indigo-light/10 transition-colors"
                      onClick={handleLinkClick}
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/portal"
                      className="block px-4 py-2 text-sm text-brand-slate hover:bg-brand-indigo-light/10 transition-colors"
                      onClick={handleLinkClick}
                    >
                      Student Portal
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      handleLinkClick();
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/contact?tab=login"
                className="text-sm font-semibold text-brand-blue-deep hover:text-brand-indigo transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/appointments"
                className="px-6 py-2.5 rounded-full bg-blue-gradient text-white text-sm font-medium tracking-wide hover:shadow-gold shadow transition-all duration-300 hover:-translate-y-0.5"
              >
                Book Consultation
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden text-brand-blue-deep hover:text-brand-gold transition-colors" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-brand-slate-light/10 py-6 px-6 flex flex-col gap-4 glass">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-base font-medium transition-colors ${isActive(link.href) ? 'text-brand-blue-deep font-bold' : 'text-brand-slate-light'}`}
              onClick={handleLinkClick}
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-brand-slate-light/10 my-2" />
          {isAuthenticated ? (
            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold text-brand-slate">Signed in as: <span className="text-brand-blue-deep">{user?.firstName}</span></span>
              {user?.role === 'ADMIN' || user?.role === 'CONSULTANT' ? (
                <Link
                  href="/admin"
                  className="px-5 py-2.5 rounded-full text-center border border-brand-blue-deep text-brand-blue-deep text-sm font-medium"
                  onClick={handleLinkClick}
                >
                  Admin Dashboard
                </Link>
              ) : (
                <Link
                  href="/portal"
                  className="px-5 py-2.5 rounded-full text-center border border-brand-blue-deep text-brand-blue-deep text-sm font-medium"
                  onClick={handleLinkClick}
                >
                  Student Portal
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  handleLinkClick();
                }}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-red-50 text-red-600 font-medium text-sm transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mt-2">
              <Link
                href="/contact?tab=login"
                className="px-5 py-2.5 rounded-full text-center border border-brand-indigo-light/20 text-brand-blue-deep text-sm font-medium"
                onClick={handleLinkClick}
              >
                Log In
              </Link>
              <Link
                href="/appointments"
                className="px-5 py-2.5 rounded-full text-center bg-blue-gradient text-white text-sm font-medium shadow hover:shadow-gold"
                onClick={handleLinkClick}
              >
                Book Consultation
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
