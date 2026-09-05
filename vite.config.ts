import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        advancedChunks: {
          groups: [
            { name: "three", test: /node_modules[\\/](three|@react-three)[\\/]/ },
            { name: "motion", test: /node_modules[\\/](gsap|@gsap|lenis)[\\/]/ },
          ],
        },
      },
    },
  },
});
