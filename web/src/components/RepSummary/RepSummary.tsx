import { type SessionDraft, TEXT } from "../../common";
import { Duration } from "../Duration";

interface RepSummaryProps {
  draft: SessionDraft;
}

export function RepSummary({ draft }: RepSummaryProps) {
  return (
    <p>
      <strong data-testid="reps">{draft.input.reps}</strong> {TEXT.REPS_UNIT} <Duration seconds={draft.input.durationSec} /> (
      {draft.fileName})
    </p>
  );
}
