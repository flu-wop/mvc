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
        emerald: {
          deep: "#0A3D33",
          mid: "#0F5244",
          light: "#1A7A60",
        },
        pink: {
          hot: "#FF1493",
          soft: "#FF69B4",
          pale: "#FFB6C1",
        },
        gold: {
          DEFAULT: "#F4C430",
          deep: "#D4A017",
          pale: "#FDE68A",
        },
        cream: "#FDF6EC",
        obsidian: "#0C0C0C",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
      },
      animation: {
        shimmer: "shimmer 2.5s linear infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 12s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gold-shimmer":
          "linear-gradient(90deg, #F4C430 0%, #FDE68A 40%, #F4C430 60%, #D4A017 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
