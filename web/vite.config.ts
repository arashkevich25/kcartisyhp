/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { coverage } from "../vitest.coverage";

export default defineConfig({
  plugins: [react()],
  server: { proxy: { "/sessions": process.env.API_URL ?? "http://127.0.0.1:3001" } },
  test: { environment: "jsdom", globals: true, setupFiles: ["./src/setupTests.ts"], coverage },
});
