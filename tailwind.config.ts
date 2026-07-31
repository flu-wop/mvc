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
        ink: "#0A0A0A",
        charcoal: "#151515",
        card: "#1C1C1C",
        border: "#2A2A2A",
        white: "#F5F5F3",
        grey: {
          DEFAULT: "#9A9A9A",
          light: "#C4C4C4",
          dark: "#6B6B6B",
        },
        gold: {
          DEFAULT: "#C9A356",
          light: "#E3C787",
          dark: "#A9824A",
        },
        silver: {
          DEFAULT: "#C0C0C0",
          light: "#E8E8E8",
          dark: "#8F8F8F",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        script: ["var(--font-script)", "cursive"],
        body: ["var(--font-dm-sans)", "sans-serif"],
      },
      animation: {
        shimmer: "shimmer 2.5s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gold-shimmer":
          "linear-gradient(90deg, #A9824A 0%, #E3C787 40%, #C9A356 60%, #A9824A 100%)",
        "silver-shimmer":
          "linear-gradient(90deg, #8F8F8F 0%, #E8E8E8 40%, #C0C0C0 60%, #8F8F8F 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
