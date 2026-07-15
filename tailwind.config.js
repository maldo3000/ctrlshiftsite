/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        syne: ['Syne', 'sans-serif'],
        bit: ['PP Neue Bit', 'Syne', 'sans-serif'],
        helvetica: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        space: ['Space Grotesk', 'sans-serif'],
        anton: ['Anton', 'sans-serif'],
        retro: ['VT323', 'monospace'],
      }
    }
  },
  plugins: [],
}
