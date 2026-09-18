/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        civic: {
          bg: '#f8fafc',
          surface: '#ffffff',
          border: '#e2e8f0',
          text: '#0f172a',
          muted: '#64748b',
          accent: '#2563eb',
          success: '#16a34a',
          warning: '#d97706',
          danger: '#dc2626',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Sora', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0,0,0,0.07), 0 4px 12px -2px rgba(0,0,0,0.05)',
        'card-hover': '0 4px 20px -4px rgba(37,99,235,0.15), 0 1px 3px rgba(0,0,0,0.07)',
        'elevated': '0 8px 32px -8px rgba(0,0,0,0.12), 0 2px 8px -2px rgba(0,0,0,0.06)',
        'inner-border': 'inset 0 0 0 1.5px rgba(37,99,235,0.25)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0ea5e9 100%)',
        'card-gradient': 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        'blue-gradient': 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        'green-gradient': 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
        'amber-gradient': 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
        'red-gradient': 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      }
    },
  },
  plugins: [],
}
