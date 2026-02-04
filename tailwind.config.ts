import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ic: {
          bg: "#f8fafc",
          card: "#ffffff",
          border: "#e5e7eb",
          text: "#0f172a",
          subtext: "#334155",
          accent: "#2563eb"
        }
      },
      boxShadow: {
        soft: "0 2px 12px rgba(0,0,0,0.06)"
      },
      borderRadius: {
        xl: "16px"
      }
    }
  },
  plugins: []
} satisfies Config;

