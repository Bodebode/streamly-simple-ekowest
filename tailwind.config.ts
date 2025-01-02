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
          accent: "#22C55E",
          text: "#FFFFFF",
          subtext: "#E5E5E5",
        },
      },
      animation: {
        "scale-up": "scale-up 0.4s ease-out",
        "scale-down": "scale-down 0.4s ease-out",
      },
      keyframes: {
        "scale-up": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        "scale-down": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.95)", opacity: "0" }
        }
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;