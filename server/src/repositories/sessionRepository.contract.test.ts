import { describe, expect, it } from "vitest";
import { InMemorySessionRepository, SqliteSessionRepository, type SessionRepository } from "./index";

const buildSession = (sessionId: string, performedAt = "2026-01-01T10:00:00.000Z", reps = 5) => ({
  sessionId,
  reps,
  durationSec: 30,
  performedAt,
});

const implementations: [string, () => SessionRepository][] = [
  ["SqliteSessionRepository", () => new SqliteSessionRepository(":memory:")],
  ["InMemorySessionRepository", () => new InMemorySessionRepository()],
];

describe.each(implementations)("%s", (_name, create) => {
  it("saves once per (userId, sessionId) and returns the stored record on repeat", () => {
    const repository = create();
    expect(repository.save("alice", buildSession("1"))).toEqual({ session: buildSession("1"), created: true });
    expect(repository.save("alice", buildSession("1", undefined, 9))).toEqual({ session: buildSession("1"), created: false });
    expect(repository.listByUser("alice")).toEqual([buildSession("1")]);
  });

  it("keeps users separate, even with the same sessionId", () => {
    const repository = create();
    repository.save("alice", buildSession("1"));
    expect(repository.save("bob", buildSession("1", undefined, 2)).created).toBe(true);
    expect(repository.listByUser("alice")[0]?.reps).toBe(5);
    expect(repository.listByUser("bob")[0]?.reps).toBe(2);
    expect(repository.listByUser("carol")).toEqual([]);
  });

  it("lists newest first, later inserts first on ties", () => {
    const repository = create();
    repository.save("alice", buildSession("old", "2026-01-01T10:00:00.000Z"));
    repository.save("alice", buildSession("new", "2026-02-01T10:00:00.000Z"));
    repository.save("alice", buildSession("tie", "2026-02-01T10:00:00.000Z"));
    expect(repository.listByUser("alice").map((stored) => stored.sessionId)).toEqual(["tie", "new", "old"]);
  });
});
