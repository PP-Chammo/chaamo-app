/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e0f7f6',
          100: '#b3ece9',
          200: '#80e0db',
          300: '#4dd4cd',
          400: '#26c8c1',
          500: '#1AAAA5',
          600: '#16968f',
          700: '#117c77',
          800: '#0c625f',
          900: '#064943',
        },
        'off-white': '#F9FBFA',
        splash: '#11b39b',
      },
      spacing: {
        4.5: '18px',
      },
    },
  },
  plugins: [],
};
