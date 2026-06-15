import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  // local dev: `vercel dev` serves /api on :3000; plain `npm run dev` falls back to mock
  server: { proxy: { "/api": "http://localhost:3000" } },
});
