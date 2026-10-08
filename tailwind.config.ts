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
        ink: "#0B0B0C",
        charcoal: "#141415",
        card: "#1A1A1B",
        border: "#2A2A2C",
        white: "#F2EDE4",
        grey: {
          DEFAULT: "#9A9A9A",
          light: "#C4C4C4",
          dark: "#6B6B6B",
        },
        gold: {
          DEFAULT: "#C9A96E",
          light: "#E0C897",
          dark: "#A08550",
        },
        silver: {
          DEFAULT: "#B8BBC0",
          light: "#E4E6E8",
          dark: "#8A8D92",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        script: ["var(--font-script)", "cursive"],
        body: ["var(--font-dm-sans)", "sans-serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
      },
      animation: {
        shimmer: "shimmer 2.5s linear infinite",
        float: "float 6s ease-in-out infinite",
        kenburns: "kenburns 14s ease-in-out infinite alternate",
      },
      keyframes: {
        kenburns: {
          "0%": { transform: "scale(1.03)" },
          "100%": { transform: "scale(1.12)" },
        },
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
