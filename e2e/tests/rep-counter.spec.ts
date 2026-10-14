import { AUTH_SCHEME, DEMO_USERS, SESSIONS_PATH } from "@rep/shared";
import { expect, test } from "@playwright/test";
import { API_URL, countFixture, FIXTURES, historyRows, saveResult, selectPatient, waitForHistory } from "./helpers";

const [ALICE, BOB] = DEMO_USERS;

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await waitForHistory(page);
});

for (const { file, reps } of Object.values(FIXTURES)) {
  test(`counts ${reps} reps for ${file}`, async ({ page }) => {
    await countFixture(page, file);
    await expect(page.getByTestId("reps")).toHaveText(String(reps));
    await expect(page.getByRole("img", { name: /knee angle/i })).toBeVisible();
  });
}

test("saves a result and keeps it after reload", async ({ page }) => {
  await selectPatient(page, ALICE.name);
  const before = await historyRows(page).count();

  await countFixture(page, FIXTURES.noisy.file);
  await saveResult(page);
  await expect(historyRows(page)).toHaveCount(before + 1);
  await expect(historyRows(page).first()).toContainText(String(FIXTURES.noisy.reps));

  await page.reload();
  await expect(historyRows(page)).toHaveCount(before + 1);
});

test("sends only the result to the server, never the angles", async ({ page }) => {
  const posted = page.waitForRequest((request) => request.method() === "POST" && request.url().endsWith(SESSIONS_PATH));
  await countFixture(page, FIXTURES.shallow.file);
  await saveResult(page);

  const body = (await posted).postDataJSON();
  expect(Object.keys(body).sort()).toEqual(["durationSec", "performedAt", "reps", "sessionId"]);
  expect(body.reps).toBe(FIXTURES.shallow.reps);
});

test("a patient only sees their own sessions", async ({ page }) => {
  await selectPatient(page, BOB.name);
  const bobBefore = await historyRows(page).count();
  await selectPatient(page, ALICE.name);
  const aliceBefore = await historyRows(page).count();

  await countFixture(page, FIXTURES.clean.file);
  await saveResult(page);
  await expect(historyRows(page)).toHaveCount(aliceBefore + 1);

  await selectPatient(page, BOB.name);
  if (bobBefore === 0) await expect(page.getByText("No sessions yet.")).toBeVisible();
  else await expect(historyRows(page)).toHaveCount(bobBefore);
});

test("retrying after a lost response saves the session once", async ({ page }) => {
  const before = await historyRows(page).count();
  let attempts = 0;
  await page.route(`**${SESSIONS_PATH}`, async (route) => {
    if (route.request().method() !== "POST") return route.continue();
    attempts++;
    if (attempts === 1) {
      // The server stores the session, but the device never gets the response.
      await route.fetch();
      return route.abort("connectionreset");
    }
    return route.continue();
  });

  await countFixture(page, FIXTURES.clean.file);
  await page.getByRole("button", { name: "Save result" }).click();
  await page.getByRole("button", { name: "Retry" }).click();
  await expect(page.getByText("Saved", { exact: true })).toBeVisible();

  expect(attempts).toBe(2);
  await expect(historyRows(page)).toHaveCount(before + 1);
});

test("shows an error for a file that is not a session", async ({ page }) => {
  await page.getByLabel("Session file").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from("{}"),
  });
  await expect(page.getByText(/not a session file/i)).toBeVisible();
  await expect(page.getByRole("button", { name: "Save result" })).toHaveCount(0);
});

test.describe("API", () => {
  const session = {
    sessionId: "e2e-api-session",
    reps: 3,
    durationSec: 12,
    performedAt: "2026-01-01T10:00:00.000Z",
  };
  const headers = (token: string) => ({ authorization: `${AUTH_SCHEME} ${token}` });

  test("requires a token", async ({ request }) => {
    expect((await request.get(`${API_URL}${SESSIONS_PATH}`)).status()).toBe(401);
    expect((await request.get(`${API_URL}${SESSIONS_PATH}`, { headers: headers("nope") })).status()).toBe(401);
  });

  test("is idempotent per sessionId and isolated per user", async ({ request }) => {
    const url = `${API_URL}${SESSIONS_PATH}`;
    expect((await request.post(url, { headers: headers(ALICE.token), data: session })).status()).toBe(201);
    expect((await request.post(url, { headers: headers(ALICE.token), data: session })).status()).toBe(200);
    expect(
      (await request.post(url, { headers: headers(ALICE.token), data: { ...session, reps: 9 } })).status(),
    ).toBe(409);

    const aliceIds = (await (await request.get(url, { headers: headers(ALICE.token) })).json()).map(
      (stored: { sessionId: string }) => stored.sessionId,
    );
    expect(aliceIds.filter((id: string) => id === session.sessionId)).toHaveLength(1);

    const bobIds = (await (await request.get(url, { headers: headers(BOB.token) })).json()).map(
      (stored: { sessionId: string }) => stored.sessionId,
    );
    expect(bobIds).not.toContain(session.sessionId);
  });
});
