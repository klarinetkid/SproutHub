import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 8080, // Replace with your desired port
    strictPort: true, // Optional: forces Vite to exit if the port is already in use
  },
  plugins: [react(), tailwindcss()],
});
