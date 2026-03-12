/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A90A4',
        secondary: '#6B9080',
        accent: '#A4C3B2',
        background: '#F6FFF8',
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Noto Sans HK', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}