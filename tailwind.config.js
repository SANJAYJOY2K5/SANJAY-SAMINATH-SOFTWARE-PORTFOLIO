/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#070a12',
          card: 'rgba(15, 23, 42, 0.75)',
          cardBorder: '#1e293b',
          accent: '#06b6d4',
          accentGlow: '#00f0ff',
          purple: '#8b5cf6',
          pink: '#ec4899',
          green: '#10b981',
          text: '#f8fafc',
          muted: '#94a3b8',
        }
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(6, 182, 212, 0.4)',
        glowPurple: '0 0 25px -5px rgba(139, 92, 246, 0.4)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)' },
          '100%': { boxShadow: '0 0 35px rgba(6, 182, 212, 0.8), 0 0 15px rgba(139, 92, 246, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
