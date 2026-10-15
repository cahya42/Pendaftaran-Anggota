/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Cinzel"', 'serif'],
      },
      colors: {
        tjokro: {
          green: '#0b5336',
          darkgreen: '#073824',
          lightgreen: '#127a50',
          mint: '#eaf6f0',
          gold: '#d97706',
          amber: '#b45309',
          lightgold: '#fef3c7',
          accentgold: '#f59e0b',
        },
      },
    },
  },
  plugins: [],
}
