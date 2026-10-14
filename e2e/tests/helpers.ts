import { resolve } from "node:path";
import { expect, type Page } from "@playwright/test";

export const FIXTURES_DIR = resolve(import.meta.dirname, "../../fixtures");
export const fixturePath = (name: string) => resolve(FIXTURES_DIR, name);

export const FIXTURES = {
  clean: { file: "session-clean.json", reps: 10 },
  noisy: { file: "session-noisy.json", reps: 8 },
  shallow: { file: "session-shallow.json", reps: 7 },
} as const;

export const API_URL = "http://127.0.0.1:3101";

export const historyRows = (page: Page) => page.locator("tbody tr");

export async function waitForHistory(page: Page) {
  await expect(page.getByText("Loading…")).toHaveCount(0);
}

/** Switches patient and waits until that patient's history has been fetched and rendered. */
export async function selectPatient(page: Page, name: string) {
  const select = page.getByLabel("Patient");
  const current = await select.locator("option:checked").textContent();
  if (current === name) return waitForHistory(page);

  const loaded = page.waitForResponse(
    (response) => response.request().method() === "GET" && response.url().endsWith("/sessions"),
  );
  await select.selectOption({ label: name });
  await loaded;
  await waitForHistory(page);
}

export async function countFixture(page: Page, file: string) {
  await page.getByLabel("Session file").setInputFiles(fixturePath(file));
}

export async function saveResult(page: Page) {
  await page.getByRole("button", { name: "Save result" }).click();
  await expect(page.getByText("Saved", { exact: true })).toBeVisible();
}
