import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — cached across deploys
          vendor: ["react", "react-dom", "react-router-dom"],
          // Firebase — large, rarely changes
          firebase: ["firebase/app", "firebase/firestore", "firebase/auth"],
          // Animation lib (if you use AOS / framer-motion)
          animations: ["aos"],
          // Icons (if you import them as a package)
          // icons: ['react-icons'],
        },
      },
    },
    // Increase warning threshold since Firebase is inherently large
    chunkSizeWarningLimit: 1000,
  },
});
