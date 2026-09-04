/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#030712',
          900: '#060d1b',
          850: '#0a1628',
          800: '#0f2038',
          700: '#1a3254',
          600: '#254773',
          500: '#346098',
        },
        scientific: {
          teal: '#0ea5e9',
          amber: '#f59e0b',
          rose: '#f43f5e',
          emerald: '#10b981',
          indigo: '#6366f1',
          slate: '#475569',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
