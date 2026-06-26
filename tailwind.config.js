/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0F1E',
        cyan: {
          DEFAULT: '#00D4FF',
        },
        violet: {
          DEFAULT: '#7C3AED',
        },
        text: {
          primary: '#F0F4FF',
          secondary: '#8B9CC8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        container: '1280px',
      },
      borderRadius: {
        card: '0.5rem',
        pill: '1rem',
      },
      keyframes: {
        'pulse-border': {
          '0%, 100%': { borderColor: 'rgba(0, 212, 255, 0.3)' },
          '50%': { borderColor: 'rgba(0, 212, 255, 0.9)' },
        },
      },
      animation: {
        'pulse-border': 'pulse-border 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
