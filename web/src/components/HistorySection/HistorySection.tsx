import type { Session } from "@rep/shared";
import { TEXT } from "../../common";
import { ErrorText } from "../ErrorText";
import { HistoryTable } from "../HistoryTable";
import { Section } from "../Section";

interface HistorySectionProps {
  sessions: Session[] | null;
  error: string | null;
}

export function HistorySection({ sessions, error }: HistorySectionProps) {
  return (
    <Section title={TEXT.HISTORY}>
      {error && <ErrorText message={error} />}
      {sessions === null ? (
        <p>{TEXT.LOADING}</p>
      ) : sessions.length === 0 ? (
        <p>{TEXT.NO_SESSIONS}</p>
      ) : (
        <HistoryTable sessions={sessions} />
      )}
    </Section>
  );
}
