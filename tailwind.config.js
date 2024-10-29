/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: {
          navigation: "#004A8F",
          button: "#00A6ED",
        },
        secondary: {
          text: "#333333",
          background: "#FAFAFA",
        },
      },
      fontFamily: {
        primary: ["Roboto", "sans-serif"],
        secondary: ["Arial", "sans-serif"],
      },
    },
  },
};
