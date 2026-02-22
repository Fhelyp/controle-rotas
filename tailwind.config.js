/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#fff8ed',
          100: '#ffefd4',
          200: '#ffd9a8',
          300: '#ffbc71',
          400: '#ff9438',
          500: '#ff7310',
          600: '#f05606',
          700: '#c73e07',
          800: '#9e320e',
          900: '#7f2b0f',
        },
      },
    },
  },
  plugins: [],
}
