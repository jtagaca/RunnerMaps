/** @type {import('tailwindcss').Config} */
const { plugin } = require("twrnc");
module.exports = {
  content: ["./App.js", "./screens/*.js", "./utilities/*.js"],
  theme: {
    extend: {
      minHeight: {
        48: "12rem",
      },
      colors: {
        jamescolor: "grey",
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        jamesbtn: {
          padding: 3,
          borderRadius: 10,
          textTransform: `uppercase`,
          backgroundColor: `jamescolor`,
        },
        "resize-repeat": {
          resizeMode: `repeat`,
        },
      });
    }),
    require("tailwindcss-brand-colors"),
  ],
};
