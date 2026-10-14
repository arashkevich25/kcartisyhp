import Database from "better-sqlite3";
import type { Session } from "@rep/shared";
import type { SaveResult, SessionRepository } from "../SessionRepository";
import { RepositoryError } from "../errors";

export class SqliteSessionRepository implements SessionRepository {
  private readonly insert;
  private readonly findOne;
  private readonly findAll;

  constructor(file: string) {
    const database = new Database(file);
    database.pragma("journal_mode = WAL");
    database.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        userId      TEXT NOT NULL,
        sessionId   TEXT NOT NULL,
        reps        INTEGER NOT NULL,
        durationSec REAL NOT NULL,
        performedAt TEXT NOT NULL,
        PRIMARY KEY (userId, sessionId)
      )`);

    this.insert = database.prepare(
      `INSERT INTO sessions (userId, sessionId, reps, durationSec, performedAt)
       VALUES (@userId, @sessionId, @reps, @durationSec, @performedAt)
       ON CONFLICT (userId, sessionId) DO NOTHING`,
    );
    this.findOne = database.prepare<[string, string], Session>(
      `SELECT sessionId, reps, durationSec, performedAt FROM sessions WHERE userId = ? AND sessionId = ?`,
    );
    this.findAll = database.prepare<[string], Session>(
      `SELECT sessionId, reps, durationSec, performedAt FROM sessions
       WHERE userId = ? ORDER BY performedAt DESC, rowid DESC`,
    );
  }

  save(userId: string, session: Session): SaveResult {
    // The primary key makes the insert atomic, so concurrent retries still store one row.
    const created = this.insert.run({ userId, ...session }).changes === 1;
    const stored = this.findOne.get(userId, session.sessionId);
    if (!stored) throw new RepositoryError("Session not found after insert");
    return { session: stored, created };
  }

  listByUser(userId: string): Session[] {
    return this.findAll.all(userId);
  }
}
