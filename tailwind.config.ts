import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  "#fdfaf5",
          100: "#f9f3e6",
          200: "#f3e9d2",
        },
        clay: {
          500: "#cc785c",
          600: "#b5614a",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        spin_slot: {
          "0%":   { transform: "translateY(0)" },
          "100%": { transform: "translateY(-66.666%)" },
        },
        pop_in: {
          "0%":   { transform: "scale(0.8)", opacity: "0" },
          "60%":  { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)",   opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-6px)" },
        },
      },
      animation: {
        spin_slot: "spin_slot var(--duration, 2s) cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
        pop_in:    "pop_in 0.4s ease forwards",
        float:     "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
