// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: "#e6f1ff",
          100: "#cce4ff",
          200: "#99c8ff",
          300: "#66adff",
          400: "#3391ff",
          500: "#0070f3",
          600: "#005cc4",
          700: "#004995",
          800: "#003566",
          900: "#002247",
        },
      },
    },
  },
  plugins: [],
};
