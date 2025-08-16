/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Next.js brand colors
        primary: {
          50: '#f0f7ff',
          100: '#e0f0ff',
          200: '#bae0ff',
          300: '#7cc7ff',
          400: '#3aabff',
          500: '#0088ff', // Primary color - Next.js blue
          600: '#0072d6',
          700: '#005db4',
          800: '#004a8c',
          900: '#003b70',
          950: '#00244d',
        },
        secondary: {
          50: '#f5f0ff',
          100: '#ebe0ff',
          200: '#dcc7fe',
          300: '#caabfc',
          400: '#b182fa',
          500: '#8a4ef5', // Secondary color - Next.js purple
          600: '#7a37e0',
          700: '#652dc0',
          800: '#52269a',
          900: '#45217c',
          950: '#2c114e',
        },
        // Additional Next.js palette
        nextjs: {
          black: '#000000',
          white: '#ffffff',
          gray: {
            100: '#f7fafc',
            200: '#edf2f7',
            300: '#e2e8f0',
            400: '#cbd5e0',
            500: '#a0aec0',
            600: '#718096',
            700: '#4a5568',
            800: '#2d3748',
            900: '#1a202c',
          },
        },
      },
    },
  },
  plugins: [],
};
