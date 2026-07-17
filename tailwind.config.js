/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#0e0d1a", // fundo da página
        surface: {
          DEFAULT: "#15132a", // cards, tabelas, modais
          raised: "#1c1a30", // hover de cards
        },
        ink: "#eceafc", // texto principal (mais claro que antes)
        mist: "#a5a1c9", // texto secundário (antes era escuro demais)
        faint: "#6f6a93", // texto terciário / placeholders
        accent: {
          DEFAULT: "#7c6ef5",
          soft: "#9b8ff5",
        },
        success: "#5dcaa5",
        warning: "#fac775",
        danger: "#f09595",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      borderColor: {
        DEFAULT: "rgba(255,255,255,0.08)",
      },
    },
  },
  plugins: [],
};
