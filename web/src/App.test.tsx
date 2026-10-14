import { AUTH_SCHEME, DEMO_USERS } from "@rep/shared";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";
import { ERRORS, FixtureParseError, JSON_CONTENT_TYPE, TEXT } from "./common";
import { parseFixture } from "./fixture";

// vitest runs with cwd = web/
const fixturePath = (name: string) => resolve(process.cwd(), "../fixtures", name);
const fixtureFile = (name: string) =>
  new File([readFileSync(fixturePath(name), "utf8")], name, { type: JSON_CONTENT_TYPE });

const fetchMock = vi.fn();
beforeEach(() => {
  fetchMock.mockReset();
  fetchMock.mockImplementation(async (_url: string, init?: RequestInit) =>
    new Response(JSON.stringify(init?.method === "POST" ? {} : []), { status: 200 }),
  );
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

describe("parseFixture", () => {
  it("rejects invalid input", () => {
    expect(() => parseFixture("nope")).toThrow(new FixtureParseError(ERRORS.INVALID_JSON));
    expect(() => parseFixture('{"angles":[]}')).toThrow(new FixtureParseError(ERRORS.INVALID_FIXTURE));
  });
});

describe("App", () => {
  it("counts reps in the browser and posts only the result", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.upload(screen.getByLabelText(new RegExp(TEXT.SESSION_FILE_LABEL, "i")), fixtureFile("session-shallow.json"));
    expect(await screen.findByTestId("reps")).toHaveTextContent("7");

    await user.click(screen.getByRole("button", { name: TEXT.SAVE_RESULT }));
    await waitFor(() => expect(screen.getByText(TEXT.SAVED)).toBeInTheDocument());

    const post = fetchMock.mock.calls.find(([, init]) => init?.method === "POST")!;
    const body = JSON.parse(post[1].body as string);
    expect(Object.keys(body).sort()).toEqual(["durationSec", "performedAt", "reps", "sessionId"]);
    expect(body.reps).toBe(7);
    expect(body.durationSec).toBe(36);
    expect(post[1].headers.authorization).toBe(`${AUTH_SCHEME} ${DEMO_USERS[0].token}`);
  });

  it("reuses the same sessionId when retrying after a failure", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.upload(screen.getByLabelText(new RegExp(TEXT.SESSION_FILE_LABEL, "i")), fixtureFile("session-clean.json"));
    await screen.findByTestId("reps");

    fetchMock.mockImplementationOnce(async () => new Response(JSON.stringify({ error: "boom" }), { status: 500 }));
    await user.click(screen.getByRole("button", { name: TEXT.SAVE_RESULT }));
    await user.click(await screen.findByRole("button", { name: TEXT.RETRY }));

    const ids = fetchMock.mock.calls
      .filter(([, init]) => init?.method === "POST")
      .map(([, init]) => JSON.parse(init.body as string).sessionId);
    expect(ids).toHaveLength(2);
    expect(ids[0]).toBe(ids[1]);
  });

  it("clears the counted file when the patient changes", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.upload(screen.getByLabelText(new RegExp(TEXT.SESSION_FILE_LABEL, "i")), fixtureFile("session-clean.json"));
    await screen.findByTestId("reps");

    await user.selectOptions(screen.getByLabelText(new RegExp(TEXT.PATIENT_LABEL, "i")), DEMO_USERS[1].name);
    expect(screen.queryByTestId("reps")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: TEXT.SAVE_RESULT })).not.toBeInTheDocument();
  });

  it("shows an error for a bad file", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.upload(screen.getByLabelText(new RegExp(TEXT.SESSION_FILE_LABEL, "i")), new File(["{}"], "invalid.json", { type: JSON_CONTENT_TYPE }));
    expect(await screen.findByText(ERRORS.INVALID_FIXTURE)).toBeInTheDocument();
  });
});
