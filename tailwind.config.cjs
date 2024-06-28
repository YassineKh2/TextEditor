/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        PlaywriteITModerna: ["PlaywriteITModerna", "cursive"],
        RobotoBlack: ["RobotoBlack", "sans-serif"],
        MontserratItalic: ["MontserratItalic", "sans-serif"],
      }
    },
  },
  plugins: [],
}