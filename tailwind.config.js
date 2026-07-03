/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0B1220',
          900: '#101A2E',
          800: '#182642',
          700: '#22335A',
          600: '#324875',
        },
        brass: {
          50: '#FDF6E9',
          200: '#F0D89B',
          400: '#D9AC4F',
          500: '#C79A3B',
          600: '#A8802D',
          700: '#846320',
        },
        sage: {
          400: '#7FAE8C',
          500: '#5B8C6A',
          600: '#456B51',
        },
        clay: {
          400: '#C97B63',
          500: '#B15F47',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
