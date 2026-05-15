import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        upfly: {
          blue: "#0A84FF",
          black: "#0A0A0C",
          white: "#FFFFFF",
          cyan: "#12D7FF",
          royal: "#004AAD",
          grey: "#4A4F57",
          success: "#00C46A",
          warning: "#FFC400",
          alert: "#FF3B3B",
          brandPurple: "#8E09CF",
          brandMagenta: "#EC0886",
        },
      },
    },
  },
} satisfies Config;
