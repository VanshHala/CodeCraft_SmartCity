/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          900: '#134e4a',
        },
        civic: {
          dark: '#0b132b',
          navy: '#1c2541',
          blue: '#3a506b',
          cyan: '#5bc0be',
          light: '#6fffe9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(15, 23, 42, 0.08)',
        'glass-hover': '0 12px 40px 0 rgba(15, 23, 42, 0.15)',
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.4)',
        'glow-crimson': '0 0 20px -3px rgba(239, 68, 68, 0.4)',
      }
    },
  },
  plugins: [],
}
