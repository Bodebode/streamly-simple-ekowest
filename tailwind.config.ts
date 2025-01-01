import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        koya: {
          background: "#141414",
          card: "#181818",
          accent: "#22C55E", // Changed from #E50914 (red) to #22C55E (green)
          text: "#FFFFFF",
          subtext: "#E5E5E5",
        },
      },
      animation: {
        "scale-up": "scale-up 0.2s ease-out",
      },
      keyframes: {
        "scale-up": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.05)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;