/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        oky: {
          primary: "#1e3a5f",
          secondary: "#4a90d9",
          accent: "#00c9a7",
          dark: "#0f172a",
          light: "#f1f5f9",
        },
      },
    },
  },
  plugins: [],
};
