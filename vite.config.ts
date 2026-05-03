// vite.config.ts

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      app: path.resolve(__dirname, "src/app"),
      pages: path.resolve(__dirname, "src/pages"),
      widgets: path.resolve(__dirname, "src/widgets"),
      features: path.resolve(__dirname, "src/features"),
      entities: path.resolve(__dirname, "src/entities"),
      shared: path.resolve(__dirname, "src/shared"),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        // @ts-ignore
        api: "modern-compiler",
      },
    },
  },

  define: {
    __IS_DEV__: JSON.stringify(process.env.NODE_ENV !== "production"),
    __API_URL__: JSON.stringify(
      process.env.VITE_API_URL ?? "http://localhost:7575",
    ),
    __PROJECT__: JSON.stringify("frontend"),
  },

  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: true,
    proxy: {
      "/api": "http://localhost:7575",
    },
  },

  build: {
    outDir: "dist",
  },
});
