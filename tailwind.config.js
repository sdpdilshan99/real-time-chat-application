/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        customColor: {
          sideBackground: "#f5fafc",
          dark: "#09132c",
          light: "#fffff",
          lightGray: "#f6f6f6",
          boxBorder: "rgb(206, 214, 227)",
          boxBorderTop: "rgba(129, 140 248, 1)",
          bubbleBackground: "#f0f4f8",
          rightBackground: "#696ee5",
          timeColor: "#829c99",
        },
      },
      gradientColorStops: {
        'custom-left': '#E4D1FF',
        'custom-right': '#A3B7FF',
      },
      boxShadow: {
        inputBoxShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)' 
      }
    },
    
  },
  plugins: [],
};
