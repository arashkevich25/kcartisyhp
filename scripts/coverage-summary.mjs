// Prints a Markdown coverage table from each workspace's coverage/coverage-summary.json.
// In CI: node scripts/coverage-summary.mjs >> "$GITHUB_STEP_SUMMARY"
import { existsSync, readFileSync } from "node:fs";

const WORKSPACES = ["shared", "server", "web"];
const METRICS = ["lines", "statements", "functions", "branches"];

const rows = WORKSPACES.filter((name) => existsSync(`${name}/coverage/coverage-summary.json`)).map((name) => {
  const { total } = JSON.parse(readFileSync(`${name}/coverage/coverage-summary.json`, "utf8"));
  return `| ${name} | ${METRICS.map((metric) => `${total[metric].pct}%`).join(" | ")} |`;
});

console.log("## Test coverage\n");
console.log(`| Package | ${METRICS.map((metric) => metric[0].toUpperCase() + metric.slice(1)).join(" | ")} |`);
console.log(`|---|${METRICS.map(() => "---:").join("|")}|`);
console.log(rows.join("\n"));
