import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#07090e",
        surface: {
          DEFAULT: "#0d121f",
          card: "#111827",
          hover: "#182238",
          border: "rgba(255, 255, 255, 0.08)",
        },
        citadel: {
          navy: "#0a0e1a",
          dark: "#060911",
          violet: {
            DEFAULT: "#8b5cf6",
            light: "#a78bfa",
            dark: "#6d28d9",
            glow: "rgba(139, 92, 246, 0.35)",
          },
          blue: {
            DEFAULT: "#38bdf8",
            light: "#7dd3fc",
            dark: "#0284c7",
            glow: "rgba(56, 189, 248, 0.35)",
          },
          cyan: "#06b6d4",
          emerald: "#10b981",
          amber: "#f59e0b",
          rose: "#f43f5e",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: {
        glow: "0 0 35px -5px rgba(139, 92, 246, 0.25)",
        "glow-blue": "0 0 35px -5px rgba(56, 189, 248, 0.25)",
        "card-glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "citadel-radial": "radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.15), transparent 70%)",
        "citadel-gradient": "linear-gradient(135deg, #8b5cf6 0%, #38bdf8 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
