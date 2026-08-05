import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1E2438",
        "ink-soft": "#4A5370",
        cream: "#FDF9F0",
        grape: "#7C3AED",
        "grape-deep": "#5B21B6",
        bubble: "#EC4899",
        mint: "#10B981",
        sun: "#F59E0B",
        tomato: "#EF4444",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(30,36,56,0.05), 0 8px 24px rgba(30,36,56,0.08)",
        "card-hover": "0 2px 4px rgba(30,36,56,0.06), 0 14px 34px rgba(30,36,56,0.14)",
      },
      keyframes: {
        "pop-in": {
          "0%": { opacity: "0", transform: "translateY(10px) scale(0.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        wiggle: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-4px)" },
          "75%": { transform: "translateX(4px)" },
        },
      },
      animation: {
        "pop-in": "pop-in 0.25s ease-out both",
        wiggle: "wiggle 0.3s ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
