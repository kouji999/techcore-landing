/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#05070B",
        carbon: "#0A0E14",
        panel: "#0F141C",
        edge: "#1A2230",
        smoke: "#8B93A3",
        bone: "#E7EAF0",
        volt: "#B8FF2E",
        voltDim: "#6E9A1A",
      },
      fontFamily: {
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      transitionTimingFunction: {
        snap: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
