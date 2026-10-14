import type { InlineConfig } from "vitest";
import { coverageConfigDefaults } from "vitest/config";

// Shared by every workspace's vitest config; used by `npm run test:coverage`.
export const coverage: InlineConfig["coverage"] = {
  provider: "v8",
  include: ["src/**"],
  // Barrels and entry points hold no logic.
  exclude: [...coverageConfigDefaults.exclude, "src/**/index.ts", "src/main.tsx", "src/setupTests.ts"],
  reporter: ["text", "html", "json-summary"],
};
