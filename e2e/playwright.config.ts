import { defineConfig } from "@playwright/test";

const API_PORT = 3101;
const WEB_PORT = 5273;
const API_URL = `http://127.0.0.1:${API_PORT}`;
const WEB_URL = `http://localhost:${WEB_PORT}`;
const DB_FILE = ".tmp/e2e.db";

// Dedicated ports and a throwaway database, so e2e never touches a running dev setup or its data.
export default defineConfig({
  testDir: "./tests",
  workers: 1,
  fullyParallel: false,
  reporter: "list",
  use: { baseURL: WEB_URL },
  webServer: [
    {
      command: `rm -rf .tmp && PORT=${API_PORT} DB_FILE=$PWD/${DB_FILE} npm run start -w server`,
      cwd: "..",
      url: API_URL,
      // The API rejects unauthenticated requests, so a 401 means it is up.
      reuseExistingServer: false,
    },
    {
      command: `API_URL=${API_URL} npm run dev -w web -- --port ${WEB_PORT} --strictPort`,
      cwd: "..",
      url: WEB_URL,
      reuseExistingServer: false,
    },
  ],
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
