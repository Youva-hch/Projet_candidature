import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      // Configuration du proxy: toutes les requêtes /api sont redirigées vers le serveur backend
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        // Ne pas utiliser rewrite pour conserver le préfixe /api
      },
    },
  },
  css: {
    // Assurer que le CSS est correctement traité
    devSourcemap: true,
  },
});
