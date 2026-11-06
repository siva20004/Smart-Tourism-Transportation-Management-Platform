/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fuji: {
          dark: '#081325',
          navy: '#0d1f3d',
          deep: '#142a50',
          blue: '#1b3a6b',
          light: '#255294',
          sky: '#38bdf8',
          lake: '#0284c7',
          ice: '#f1f5f9',
          snow: '#ffffff',
          slate: '#475569',
          crimson: '#be123c',
          gold: '#c59b27',
          bronze: '#9a7317',
          champagne: '#fbf7ee',
          emerald: '#047857',
        },
        classic: {
          bg: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
          borderDark: '#cbd5e1',
          textMain: '#0f172a',
          textMuted: '#64748b',
          gold: '#c59b27',
          goldBg: '#fefce8',
          goldBorder: '#fef08a',
          navy: '#0c1b33',
          header: '#ffffff',
        }
      },
      fontFamily: {
        sans: ['"Inter"', '"Noto Sans JP"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['"Noto Serif JP"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'classic': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'classic-md': '0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.06)',
        'classic-hover': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
      }
    },
  },
  plugins: [],
}
