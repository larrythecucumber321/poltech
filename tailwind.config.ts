import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#fafaf9",
          dark: "#0e0803",
        },
        foreground: {
          DEFAULT: "#292524",
          dark: "#ebe9e7",
        },
        primary: {
          DEFAULT: "#c28f0e",
          light: "#ddad32",
          dark: "#fbbf24",
        },
        secondary: {
          DEFAULT: "#6B4312",
          dark: "#6B4312",
        },
        accent: {
          DEFAULT: "#56f253",
          dark: "#00ff2a",
        },
        border: {
          DEFAULT: "#e7e5e4",
          dark: "#373332",
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
