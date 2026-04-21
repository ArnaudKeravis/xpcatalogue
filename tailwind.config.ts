import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
      },
      colors: {
        blue: {
          DEFAULT: '#293896',
          solid: '#173da6',
          primary: '#1a69ff',
        },
        teal: '#00d1c7',
        surface: '#f4f7ff',
      },
      /* Brand radii — single source of truth shared with tokens.css so `rounded-brand-*`
         utilities stop us from writing arbitrary `rounded-[Npx]` values. */
      borderRadius: {
        'brand-xs': '0.25rem',
        'brand-sm': '0.5rem',
        'brand-md': '0.75rem',
        'brand-lg': '1.25rem',
        xl: '1.5625rem',
        'brand-xl': '1.5625rem',
        'brand-2xl': '1.75rem',
        'brand-3xl': '2.5rem',
        pill: '6.25rem',
      },
      boxShadow: {
        card: '0 4px 10.8px 0 rgba(0,28,122,0.35)',
        panel: '6px 12px 38.4px 0 rgba(41,56,150,0.29)',
        soft: '8px -3px 44.9px 6px rgba(41,56,150,0.1)',
      },
    },
  },
  plugins: [],
};

export default config;
