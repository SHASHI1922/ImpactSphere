/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#143D2A',
          900: '#0E291C',
          800: '#143D2A',
          700: '#1C543A',
        },
        primaryGreen: {
          DEFAULT: '#23834A',
          light: '#2EA65F',
          dark: '#1C693B',
        },
        limeAccent: {
          DEFAULT: '#B7E36B',
          light: '#CEEE94',
          dark: '#9AC64F',
        },
        warmIvory: {
          DEFAULT: '#F7F7F0',
          50: '#FCFCF9',
          100: '#F7F7F0',
          200: '#ECECE2',
          300: '#DFDFD1',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
