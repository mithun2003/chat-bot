/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,ts,css,scss,sass,less,style}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      "main-background-color": "var(--main-background-color)",
      "secondary-background-color": "var(--secondary-background-color)",
      "tertiary-background-color": "var(--tertiary-background-color)",
      "quaternary-background-color": "var(--quaternary-background-color)",
      "common-green-color": "var(--common-green-color)",
      "common-red-color": "var(--common-red-color)",
      "tertiary-red-color": "var(--tertiary-red-color)",
      "secondary-red-color": "var(--secondary-red-color)",
      "tertiary-green-color": "var(--tertiary-green-color)",
      "common-blue-color": "var(--common-blue-color)",
      "secondary-blue-color": "var(--secondary-blue-color)",
      "common-yellow-color": "var(--common-yellow-color)",
      "main-font-color": "var(--main-font-color)",
      "secondary-font-color": "var(--secondary-font-color)",
      "border-color": "var(--border-color)",
      "ag-grid-header-color": "var(--ag-grid-header-color)",
      "ag-grid-header-filter-color": "var(--ag-grid-header-filter-color)",
      white: "#FFFFFF",
      black: "#000000"
    },
    extend: {
      fontFamily: {
        inter: ["var(--inter)"],
        raleway: ["var(--raleway)"],
        spaceMono: ["var(--space-mono)"],
        nicomoji: ["var(--nicomoji)"],
        nunitoSans: ["var(--nunito-sans)"]
      },
      boxShadow: {
        "main-shadow": "0 6px 10px 0 var(--primary-shadow-color)",
        "common-button-shadow": "0px 2px 6px 0px rgba(140, 140, 140, 0.25)"
      }
    }
  },
  plugins: []
};
