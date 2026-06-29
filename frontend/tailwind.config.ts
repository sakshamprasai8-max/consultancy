import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            deep: '#1a237e', // Primary: Deep Royal Blue
            light: '#283593',
          },
          indigo: {
            DEFAULT: '#3f51b5', // Secondary: Elegant Indigo
            light: '#7986cb',
            dark: '#303f9f',
          },
          gold: {
            DEFAULT: '#d4af37', // Accent: Premium Gold
            light: '#f3e5ab',
            dark: '#aa7c11',
          },
          cyan: {
            DEFAULT: '#00e5ff', // Highlight: Soft Cyan
            light: '#18ffff',
            dark: '#00b8d4',
          },
          slate: {
            DEFAULT: '#1e293b', // Text: Dark Slate
            light: '#475569',
            dark: '#0f172a',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
        'glass-hover': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        gold: '0 4px 14px 0 rgba(212, 175, 55, 0.2)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
