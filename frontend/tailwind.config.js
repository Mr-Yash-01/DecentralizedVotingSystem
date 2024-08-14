/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      'voting-background-Image' : "url('frontend/src/assets/icons8-voting-64.png')"
    },
  },
  plugins: [],
}