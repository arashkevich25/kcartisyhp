import type { Session } from "@rep/shared";

export interface SaveResult {
  session: Session;
  created: boolean;
}

export interface SessionRepository {
  save(userId: string, session: Session): SaveResult;
  listByUser(userId: string): Session[];
}
