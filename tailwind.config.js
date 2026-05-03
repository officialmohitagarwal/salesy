/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0B1220",
        secondary: "#111827",
        accent: "#1F2937",
      },
    },
  },
  plugins: [],
};