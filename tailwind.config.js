/**
 * Farben kommen aus CSS-Variablen (siehe src/index.css: :root = hell, .dark = dunkel),
 * damit ein Themewechsel keine Komponente anfassen muss.
 */
const v = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

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
          DEFAULT: v('surface'),
          raised: v('surface-raised'),
          overlay: v('surface-overlay'),
          border: v('surface-border'),
        },
        ink: {
          DEFAULT: v('ink'),
          muted: v('ink-muted'),
          faint: v('ink-faint'),
        },
        accent: {
          DEFAULT: v('accent'),
          strong: v('accent-strong'),
          soft: v('accent-soft'),
        },
        warn: v('warn'),
        good: v('good'),
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
