import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3B82F6",
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
        },
        accent: {
          DEFAULT: "#F59E0B",
          50: "#FFFBEB",
          100: "#FEF3C7",
        },
        success: {
          DEFAULT: "#10B981",
          50: "#ECFDF5",
          100: "#D1FAE5",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "var(--font-noto-kr)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-jakarta)", "var(--font-noto-kr)", "sans-serif"],
        body: ["var(--font-noto-kr)", "var(--font-jakarta)", "sans-serif"],
        num: ["var(--font-dm-sans)", "var(--font-jakarta)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        DEFAULT: "10px",
        lg: "14px",
        xl: "20px",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        shimmer: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "mesh-move": {
          "0%, 100%": { backgroundPosition: "0% 50%", transform: "scale(1)" },
          "25%": { backgroundPosition: "50% 0%", transform: "scale(1.05)" },
          "50%": { backgroundPosition: "100% 50%", transform: "scale(1)" },
          "75%": { backgroundPosition: "50% 100%", transform: "scale(1.05)" },
        },
        "gradient-text": {
          "0%": { backgroundPosition: "0% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "pulse-ring": {
          "0%": { opacity: "0.5", transform: "translate(-50%, -50%) scale(1)" },
          "80%, 100%": { opacity: "0", transform: "translate(-50%, -50%) scale(1.5)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.3)" },
        },
        "light-sweep": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
        shimmer: "shimmer 2s linear infinite",
        "mesh-move": "mesh-move 8s ease-in-out infinite",
        "gradient-text": "gradient-text 3s linear infinite",
        "pulse-ring": "pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "light-sweep": "light-sweep 3s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
      },
      boxShadow: {
        subtle:
          "0 1px 2px 0 rgb(0 0 0 / 0.03), 0 1px 3px 0 rgb(0 0 0 / 0.04)",
        card: "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 4px 12px 0 rgb(0 0 0 / 0.03)",
        elevated:
          "0 4px 16px 0 rgb(0 0 0 / 0.06), 0 1px 4px 0 rgb(0 0 0 / 0.04)",
        float:
          "0 8px 32px 0 rgb(0 0 0 / 0.08), 0 2px 8px 0 rgb(0 0 0 / 0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
