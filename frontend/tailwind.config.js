/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: { DEFAULT: "#173826", light: "#2f5d43" },
        moss: "#dfe6c8",
        cream: "#f6f3e9",
        sun: "#f2a93b",
      },
      fontFamily: { display: ["Fraunces", "serif"], sans: ["Manrope", "sans-serif"] },
    },
  },
  plugins: [],
};
