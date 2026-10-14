# Rep Counter

Counts squats from a knee-angle signal in the browser, saves the result to a small API, and lists the session history.

```
npm install
npm start        # API on :3001, web on http://localhost:5173
npm test         # unit/API tests: shared + server + web
npm run test:coverage # same, with coverage reports in <package>/coverage
npm run test:e2e # Playwright, full stack (first time: npx playwright install chromium)
npm run typecheck
```

Node 22+. Pick a file from [`fixtures/`](fixtures) in the UI. Switch between Alice and Bob to see per-user history.

## Layout

| Package | What |
|---|---|
| `shared/` | `countReps`, Zod schemas and types used by both sides (consumed as TS source, no build step) |
| `server/` | Fastify routes (`app.ts`) depend on a `SessionRepository` interface. `repositories/sqlite` (`better-sqlite3`, `server/data/sessions.db`) is used at runtime; `repositories/in-memory` is the alternative. Both run the same contract tests. |
| `web/` | Vite + React + TypeScript, with a Vite proxy for `/sessions` |
| `e2e/` | Playwright tests against the real API and web app, on separate ports with a throwaway database |

## Assumptions

- **Rep rule:** angle `< 100°` arms a rep, then `> 160°` completes it. Values in between change nothing, so noise near a threshold can't double count. A squat still down at the end of the data is not counted. Non-finite values are skipped.
- **Duration:** `angles.length / sampleRateHz`, rounded to 2 decimals.
- **Idempotency:** the primary key is `(userId, sessionId)` and the insert is `ON CONFLICT DO NOTHING`, so concurrent retries still store one row. First save returns `201`; a retry with the same data returns `200` with the stored record; the same `sessionId` with different data returns `409`. The same `sessionId` from two users is two separate sessions.
- **Auth:** `Authorization: Bearer <token>`. Hard-coded tokens: `token-alice`, `token-bob`. Every query is scoped to the user behind the token; a missing or unknown token gets `401`.
- **Privacy:** only `{ sessionId, reps, durationSec, performedAt }` is sent. The angles stay in the browser.
- The client generates a `sessionId` per counted file and reuses it when the user hits "Retry" after a failed save.
- `performedAt` may carry any offset; the server normalises it to UTC before storing. Sessions are listed newest first, and a retry that writes the same instant differently still counts as a retry.
- A counted file belongs to the patient selected when it was loaded: switching patient clears it, so one session can't be saved for two people.

## What I'd do next

- Real auth (signed tokens, user table) instead of hard-coded ones.
- Serve the built web app from the API, and add pagination to `GET /sessions`.
- Highlight the counted reps on the chart.
- An offline queue on the client for saves that fail on a bad connection.

## AI agent notes

See [AGENTS.md](AGENTS.md) for the instructions given to the agent.

**One thing it got wrong:** the agent stored `performedAt` exactly as sent and sorted it as a string. It even wrote that assumption into this README ("assumes a consistent offset such as `Z`") instead of fixing it, and all tests passed. I noticed when I asked it to review the project against the brief and probe the API directly: a session at `12:00+05:00` (07:00 UTC) was listed above one at `10:00Z`. The same root cause made a retry at the same moment, written in a different format, fail with a `409`. The fix was to normalise to UTC in the shared schema, plus regression tests for both cases.
