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
        // Editorial Palette: Earthy Greens, Vibrant Oranges, Soft Cream
        "earth-green-50": "#f5f7f2",
        "earth-green-100": "#e8ede4",
        "earth-green-200": "#d4e0c9",
        "earth-green-300": "#b8c9a7",
        "earth-green-400": "#9cb386",
        "earth-green-500": "#7a9664",
        "earth-green-600": "#5f7a4d",
        "earth-green-700": "#4a613e",
        "earth-green-800": "#3e5234",
        "earth-green-900": "#35452e",

        "vibrant-orange-50": "#fff5ed",
        "vibrant-orange-100": "#ffe5d0",
        "vibrant-orange-200": "#ffcba3",
        "vibrant-orange-300": "#ffa366",
        "vibrant-orange-400": "#ff7633",
        "vibrant-orange-500": "#f5530d",
        "vibrant-orange-600": "#d93800",
        "vibrant-orange-700": "#b22d00",
        "vibrant-orange-800": "#932700",
        "vibrant-orange-900": "#7c2400",

        "soft-cream": "#faf9f5",
        "soft-cream-dark": "#f0ede4",
        "editorial-black": "#1a1a1a",
        "editorial-gray": "#6b6b6b",
        "editorial-light": "#e5e5e5",
      },
      fontFamily: {
        "serif": ["Playfair Display", "Georgia", "serif"],
        "sans": ["Inter", "system-ui", "sans-serif"],
        "display": ["Playfair Display", "Georgia", "serif"],
      },
      borderRadius: {
        "xl": "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        "4xl": "2.5rem",
      },
      boxShadow: {
        "glass": "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
        "glass-strong": "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        "editorial": "0 2px 8px rgba(0, 0, 0, 0.08)",
        "editorial-strong": "0 4px 16px rgba(0, 0, 0, 0.12)",
      },
      backdropBlur: {
        "glass": "12px",
        "glass-strong": "16px",
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
        "spin-slow": "spin 3s linear infinite",
        "avatar-explode": "avatarExplode 0.8s ease-out forwards",
        "coin-gain": "coinGain 0.6s ease-out forwards",
        "level-up": "levelUp 1s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        avatarExplode: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.5)", opacity: "0.8" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
        coinGain: {
          "0%": { transform: "translateY(0) scale(1)", opacity: "1" },
          "100%": { transform: "translateY(-30px) scale(1.2)", opacity: "0" },
        },
        levelUp: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
