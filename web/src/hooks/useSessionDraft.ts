import { useState } from "react";
import { countReps } from "@rep/shared";
import { DURATION_DECIMALS, ERRORS, type SessionDraft } from "../common";
import { parseFixture } from "../fixture";

/** Reads a fixture file and counts its reps in the browser. The angles never leave it. */
export function useSessionDraft() {
  const [draft, setDraft] = useState<SessionDraft | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadFile(file: File | undefined) {
    setError(null);
    if (!file) return;
    try {
      const fixture = parseFixture(await file.text());
      setDraft({
        fileName: file.name,
        angles: fixture.angles,
        input: {
          sessionId: crypto.randomUUID(),
          reps: countReps(fixture.angles),
          durationSec: Number((fixture.angles.length / fixture.sampleRateHz).toFixed(DURATION_DECIMALS)),
          performedAt: new Date().toISOString(),
        },
      });
    } catch (caught) {
      setDraft(null);
      setError(caught instanceof Error ? caught.message : ERRORS.READ_FILE_FAILED);
    }
  }

  return { draft, error, loadFile };
}
