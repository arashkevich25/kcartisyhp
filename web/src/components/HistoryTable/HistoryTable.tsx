import type { Session } from "@rep/shared";
import { TEXT } from "../../common";
import { HistoryRow } from "../HistoryRow";

interface HistoryTableProps {
  sessions: Session[];
}

export function HistoryTable({ sessions }: HistoryTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>{TEXT.COLUMN_WHEN}</th>
          <th>{TEXT.COLUMN_REPS}</th>
          <th>{TEXT.COLUMN_DURATION}</th>
        </tr>
      </thead>
      <tbody>
        {sessions.map((session) => (
          <HistoryRow key={session.sessionId} session={session} />
        ))}
      </tbody>
    </table>
  );
}
