import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0e1a',
        bgsoft: '#0d1224',
        card: '#12172a',
        cardborder: '#1f2540',
        dim: '#8b93ad',
        accenta: '#3b82f6',
        accentb: '#8b5cf6',
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
