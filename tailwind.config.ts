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
        primary: "#00341c",      // Dark green
        secondary: "#006034",    // Less dark green
        tertiary: "#b4fed7",
        "secondary-dark": "#e5e7eb",
        "primary-light": "#1e40af",
        "lime-green": "#d8ffeb",
        
        success: {
          DEFAULT: '#207C29',   // Green
          light: '#25922F',     // Lighter version
          dark: '#1B6623',      // Darker version
        },
        error: {
          DEFAULT: '#C81212',   // Red
          light: '#E01515',     // Lighter version
          dark: '#A80F0F',      // Darker version
        },
        
        
      },
      rotate: {
        'y-180': 'rotateY(180deg)',
      },
      perspective: {
        '1000': '1000px',
      },
    },
  },
  plugins: [],
};

export default config;
