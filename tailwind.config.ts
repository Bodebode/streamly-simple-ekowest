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
        "fade-out-title": "fade-out-title 4s ease-out forwards",
        "bounce-x": "bounce-x 1s ease-in-out",
        "fade-in": "fade-in 0.5s ease-out",
      },
      keyframes: {
        "scale-up": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        "scale-down": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.95)", opacity: "0" }
        },
        "fade-out-title": {
          "0%, 50%": { opacity: "1" },
          "100%": { opacity: "0" }
        },
        "bounce-x": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(10px)" }
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;