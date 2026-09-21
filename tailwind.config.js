/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        surface: {
          DEFAULT: '#F4F4F5',
          raised: '#FFFFFF',
          overlay: '#E4E4E7',
          border: '#D4D4D8',
        },
        ink: {
          DEFAULT: '#18181B',
          muted: '#52525B',
          faint: '#71717A',
        },
        accent: {
          DEFAULT: '#3F3F46',
          strong: '#27272A',
          soft: '#E4E4E7',
        },
        warn: '#C2410C',
        good: '#15803D',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
      },
      boxShadow: {
        card: '0 1px 0 rgba(255,255,255,0.03) inset, 0 8px 20px -12px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
};
