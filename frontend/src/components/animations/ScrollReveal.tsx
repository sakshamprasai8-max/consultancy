'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
}

export default function ScrollReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 0.6,
}: ScrollRevealProps) {
  const getVariants = () => {
    const hiddenOffset = 40;
    const variants = {
      hidden: {
        opacity: 0,
        x: direction === 'left' ? hiddenOffset : direction === 'right' ? -hiddenOffset : 0,
        y: direction === 'up' ? hiddenOffset : direction === 'down' ? -hiddenOffset : 0,
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration: duration,
          delay: delay,
          ease: [0.25, 1, 0.5, 1], // Custom premium ease out
        },
      },
    };
    return variants;
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={getVariants()}
      className={className}
    >
      {children}
    </motion.div>
  );
}
