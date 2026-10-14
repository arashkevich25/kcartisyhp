import { AUTH_SCHEME, DEMO_USERS, SESSIONS_PATH } from "@rep/shared";
import { beforeEach, describe, expect, it } from "vitest";
import { buildApp } from "./app";
import { ERROR_MESSAGES, HTTP_STATUS } from "./constants";
import { SqliteSessionRepository } from "./repositories";

const IN_MEMORY_DB = ":memory:";
const [ALICE, BOB] = DEMO_USERS;

const authHeaders = (token: string) => ({ authorization: `${AUTH_SCHEME} ${token}` });
const aliceHeaders = authHeaders(ALICE.token);
const bobHeaders = authHeaders(BOB.token);

const session = {
  sessionId: "session-1",
  reps: 10,
  durationSec: 36.3,
  performedAt: "2026-01-01T10:00:00.000Z",
};

let app: ReturnType<typeof buildApp>;
beforeEach(() => {
  app = buildApp(new SqliteSessionRepository(IN_MEMORY_DB));
});

const post = (headers: Record<string, string>, payload: unknown) =>
  app.inject({ method: "POST", url: SESSIONS_PATH, headers, payload: payload as object });
const list = (headers: Record<string, string>) => app.inject({ method: "GET", url: SESSIONS_PATH, headers });
const sessionIds = async (headers: Record<string, string>) =>
  (await list(headers)).json().map((stored: { sessionId: string }) => stored.sessionId);

describe("auth", () => {
  it("rejects missing token", async () => {
    expect((await list({})).statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);
    expect((await post({}, session)).statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);
  });

  it("rejects unknown token", async () => {
    expect((await list(authHeaders("unknown-token"))).statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);
    expect((await list(authHeaders("constructor"))).statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);
  });
});

describe(`POST ${SESSIONS_PATH}`, () => {
  it("creates a session", async () => {
    const response = await post(aliceHeaders, session);
    expect(response.statusCode).toBe(HTTP_STATUS.CREATED);
    expect(response.json()).toEqual(session);
  });

  it("saves a retried sessionId once", async () => {
    expect((await post(aliceHeaders, session)).statusCode).toBe(HTTP_STATUS.CREATED);
    const retry = await post(aliceHeaders, session);
    expect(retry.statusCode).toBe(HTTP_STATUS.OK);
    expect(retry.json()).toEqual(session);
    expect(await sessionIds(aliceHeaders)).toHaveLength(1);
  });

  it("saves once under concurrent retries", async () => {
    await Promise.all([post(aliceHeaders, session), post(aliceHeaders, session), post(aliceHeaders, session)]);
    expect(await sessionIds(aliceHeaders)).toHaveLength(1);
  });

  it("rejects a reused sessionId with different data", async () => {
    await post(aliceHeaders, session);
    expect((await post(aliceHeaders, { ...session, reps: 3 })).statusCode).toBe(HTTP_STATUS.CONFLICT);
    expect((await list(aliceHeaders)).json()[0].reps).toBe(session.reps);
  });

  it("validates the body", async () => {
    const invalidBodies = [
      {},
      { ...session, reps: -1 },
      { ...session, reps: 1.5 },
      { ...session, sessionId: "" },
      { ...session, performedAt: "yesterday" },
      { ...session, durationSec: "36" },
    ];
    for (const invalidBody of invalidBodies) {
      expect((await post(aliceHeaders, invalidBody)).statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
    }
  });
});

describe(`GET ${SESSIONS_PATH}`, () => {
  it("only returns the caller's sessions", async () => {
    await post(aliceHeaders, session);
    await post(bobHeaders, { ...session, sessionId: "session-bob", reps: 4 });
    expect(await sessionIds(aliceHeaders)).toEqual([session.sessionId]);
    expect(await sessionIds(bobHeaders)).toEqual(["session-bob"]);
  });

  it("does not let another user's sessionId collide or leak", async () => {
    await post(aliceHeaders, session);
    const response = await post(bobHeaders, { ...session, reps: 2 });
    expect(response.statusCode).toBe(HTTP_STATUS.CREATED);
    expect((await list(aliceHeaders)).json()[0].reps).toBe(session.reps);
    expect((await list(bobHeaders)).json()[0].reps).toBe(2);
  });

  it("lists newest first", async () => {
    await post(aliceHeaders, session);
    await post(aliceHeaders, { ...session, sessionId: "session-2", performedAt: "2026-02-01T10:00:00.000Z" });
    expect(await sessionIds(aliceHeaders)).toEqual(["session-2", session.sessionId]);
  });
});

describe("error responses", () => {
  it("returns a JSON error body for unauthorized, validation and conflict errors", async () => {
    expect((await list({})).json()).toEqual({ error: ERROR_MESSAGES.INVALID_TOKEN });
    expect((await post(aliceHeaders, {})).json()).toMatchObject({ error: ERROR_MESSAGES.INVALID_SESSION });
    await post(aliceHeaders, session);
    expect((await post(aliceHeaders, { ...session, reps: 3 })).json()).toEqual({
      error: ERROR_MESSAGES.SESSION_ID_CONFLICT,
    });
  });

  it("keeps the error shape for malformed JSON", async () => {
    const response = await app.inject({
      method: "POST",
      url: SESSIONS_PATH,
      headers: { ...aliceHeaders, "content-type": "application/json" },
      payload: "{not json",
    });
    expect(response.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(response.json()).toHaveProperty("error");
  });
});
