import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          bg: "var(--surface-bg)",
          bg2: "var(--bg-secondary)",
          card: "var(--bg-card)",
        },
        light: {
          bg: "var(--bg-primary)",
          card: "var(--bg-card)",
          border: "var(--border)",
        },
        accent: {
          primary: "var(--accent)",
          secondary: "var(--accent-cyan)",
          "secondary-light": "var(--accent-cyan)",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        muted: "var(--text-secondary)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
        sora: ["var(--font-sora)", "system-ui", "sans-serif"],
        arabic: ["var(--font-cairo)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px #6C63FF59",
        "glow-cyan": "0 0 40px #00D4FF4D",
        glass: "0 8px 32px #00000040",
        soft: "0 4px 24px #0000001F",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient":
          "linear-gradient(135deg, #0B1020 0%, #121A2F 50%, #1B2540 100%)",
        "accent-gradient": "linear-gradient(135deg, #6C63FF 0%, #00D4FF 100%)",
        "calm-gradient": "linear-gradient(135deg, #1a2744 0%, #2d4a6f 50%, #6C63FF33 100%)",
      },
      animation: {
        "pulse-slow": "pulse 4s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
