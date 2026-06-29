'use client';

import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = '',
  hoverable = true,
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`glass rounded-2xl p-6 transition-all duration-300 ${onClick ? 'cursor-pointer' : ''} ${hoverable ? 'hover:-translate-y-1.5 hover:shadow-glass-hover hover:border-brand-gold/30' : 'shadow-glass'} ${className}`}
    >
      {children}
    </div>
  );
}
