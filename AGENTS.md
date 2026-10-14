# Instructions for AI agents

Project: rep counter (Node + TypeScript + React). Read README.md first.

- npm workspaces: `shared` (countReps, Zod schemas, demo users), `server` (Fastify + SQLite), `web` (Vite + React), `e2e` (Playwright).
- The rep rule is fixed: below 100° then above 160°. Never change it without updating the fixture tests; the three files in `fixtures/` define the expected counts (clean 10, noisy 8, shallow 7).
- Angles must never be sent to the server. The API accepts exactly `{ sessionId, reps, durationSec, performedAt }`.
- Every route requires a token; every query must be scoped by `userId`. Saving must be idempotent per `(userId, sessionId)` at the database level, not by check-then-insert.
- Backend uses the repository pattern: routes depend only on `SessionRepository`; each implementation lives in its own folder under `server/src/repositories/` (SQL only in `sqlite/`). New implementations must pass `sessionRepository.contract.test.ts`.
- Shared contracts (paths, schemas, types) live in `shared/` and are imported by both sides. Don't duplicate them.
- Web: one component per folder (`Component.tsx`, `Component.test.tsx`, `index.ts`); UI strings and error messages go in `web/src/common/constants.ts`.
- Keep it small: no Next.js, ORM, state library or UI kit.
- Verify before finishing: `npm run typecheck && npm test && npm run test:e2e`, then run `npm start` and hit `/sessions` once.
- Don't commit secrets or `*.db` files. Don't rewrite git history.
