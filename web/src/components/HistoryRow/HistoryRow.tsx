import type { Session } from "@rep/shared";
import { Duration } from "../Duration";

interface HistoryRowProps {
  session: Session;
}

export function HistoryRow({ session }: HistoryRowProps) {
  return (
    <tr>
      <td>{new Date(session.performedAt).toLocaleString()}</td>
      <td>{session.reps}</td>
      <td>
        <Duration seconds={session.durationSec} />
      </td>
    </tr>
  );
}
