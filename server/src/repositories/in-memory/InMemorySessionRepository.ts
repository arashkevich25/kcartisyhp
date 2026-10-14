import type { Session } from "@rep/shared";
import type { SaveResult, SessionRepository } from "../SessionRepository";

export class InMemorySessionRepository implements SessionRepository {
  private readonly byUser = new Map<string, Map<string, Session>>();

  save(userId: string, session: Session): SaveResult {
    let sessions = this.byUser.get(userId);
    if (!sessions) this.byUser.set(userId, (sessions = new Map()));
    const existing = sessions.get(session.sessionId);
    if (existing) return { session: existing, created: false };
    sessions.set(session.sessionId, { ...session });
    return { session, created: true };
  }

  listByUser(userId: string): Session[] {
    const sessions = [...(this.byUser.get(userId)?.values() ?? [])];
    // Array.sort is stable: reverse first so later inserts win ties, like rowid DESC in SQLite.
    return sessions
      .reverse()
      .sort((first, second) =>
        first.performedAt < second.performedAt
          ? 1
          : first.performedAt > second.performedAt
            ? -1
            : 0,
      );
  }
}
