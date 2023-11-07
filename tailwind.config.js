/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  // darkMode: false,
  theme: {
    extend: {
      colors: {
        app_primary: {
          light: "#232F3E",
          DEFAULT: "#8458B3",
        },
        app_secondary: {
          DEFAULT: "#48BB78",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
