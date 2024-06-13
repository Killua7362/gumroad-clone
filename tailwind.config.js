/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
    divideStyle: true,
  },
  content: ["./client/**/*.{tsx,ts,js,html,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "#09090B",
        foreground: "#020817",
        primary: "#3B82F6",
        secondary: "#1E293B",
        accent: "#27272A",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
