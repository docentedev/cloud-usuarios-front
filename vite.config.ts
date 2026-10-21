import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

const apiPersonajesTarget =
  "https://wznplg0ho7.execute-api.us-east-2.amazonaws.com";

// El API Gateway no tiene CORS habilitado para localhost, así que en desarrollo
// proxeamos /api-personajes hacia el endpoint real.
const proxy = {
  "/api-personajes": {
    target: apiPersonajesTarget,
    changeOrigin: true,
    rewrite: (path: string) =>
      path.replace(/^\/api-personajes/, "/prod/api/personajes"),
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { proxy },
  preview: { proxy },
});
