/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [require("daisyui")],

  daisyui: {
    styled: true,
    themes: ["dark"],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
  },
}