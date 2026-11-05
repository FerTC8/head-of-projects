/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,ts,js}",
    "./templates/**/*.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#0071e3', // Apple Blue
          600: '#005bb5',
          900: '#002952',
        },
        surface: {
          dark: '#0c0e14',
          card: '#161922',
          border: 'rgba(255, 255, 255, 0.08)',
          glass: 'rgba(22, 25, 34, 0.75)',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ]
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        glow: '0 0 25px -5px rgba(0, 113, 227, 0.4)'
      }
    },
  },
  plugins: [],
}
