/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // all React source files
  ],
  theme: {
    extend: {
      colors: {
        primary: "#373737", // Custom primary color
        secondary: "#0A0A0A", // Custom secondary color
        accent1: "#DDDAD0", // Custom accent color
        accent2: "#F8F3CE",
      },
    },
  },
  plugins: [],
};
