import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../providers/AuthProvider';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export const metadata: Metadata = {
  title: 'EduConsult Pro | Premium Study Abroad Educational Consultancy',
  description:
    'EduConsult Pro is a premium educational consultancy offering world-class student visa consulting, study abroad advisory, scholarship support, and university admission guidance.',
  keywords: [
    'study abroad',
    'student visa consulting',
    'university admission support',
    'scholarships',
    'educational consultancy',
    'study in Canada',
    'study in Australia',
    'study in UK',
  ],
  authors: [{ name: 'EduConsult Pro Team' }],
  openGraph: {
    title: 'EduConsult Pro | Premium Study Abroad Advisory',
    description: 'Bespoke admission counseling and student visa consulting for world-class destinations.',
    url: 'https://educonsultpro.com',
    siteName: 'EduConsult Pro',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <Navbar />
          <main className="pt-24 min-h-[80vh]">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
