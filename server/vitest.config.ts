import { defineConfig } from "vitest/config";
import { coverage } from "../vitest.coverage";

export default defineConfig({ test: { environment: "node", coverage } });
