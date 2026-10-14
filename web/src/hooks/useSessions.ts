import { useCallback, useEffect, useRef, useState } from "react";
import type { Session } from "@rep/shared";
import { listSessions } from "../api";
import { ERRORS } from "../common";

/** Loads the sessions of the patient behind `token`; null while loading. */
export function useSessions(token: string) {
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const latestToken = useRef(token);
  latestToken.current = token;

  const reload = useCallback(async () => {
    const requestedToken = latestToken.current;
    try {
      const loaded = await listSessions(requestedToken);
      // Ignore a response that arrives after the patient was switched.
      if (latestToken.current !== requestedToken) return;
      setSessions(loaded);
      setError(null);
    } catch (caught) {
      if (latestToken.current !== requestedToken) return;
      setSessions([]);
      setError(caught instanceof Error ? caught.message : ERRORS.LOAD_SESSIONS_FAILED);
    }
  }, []);

  useEffect(() => {
    setSessions(null);
    void reload();
  }, [token, reload]);

  return { sessions, error, reload };
}
