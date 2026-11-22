/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        night: {
          950: '#030409',
          900: '#060812',
          800: '#0a0e1d',
          700: '#101628',
        },
        gold: {
          300: '#f5dfa0',
          400: '#eccd7a',
          500: '#d9ac4e',
          600: '#b4842f',
        },
        aether: {
          300: '#7ff4ff',
          400: '#3fd9ee',
          500: '#17b8d4',
        },
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        sans: ['Rajdhani', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.35em',
      },
    },
  },
  plugins: [],
};
