import { TEXT } from "../../common";
import { useSaveSession } from "../../hooks/useSaveSession";
import { useSessionDraft } from "../../hooks/useSessionDraft";
import { AngleChart } from "../AngleChart";
import { ErrorText } from "../ErrorText";
import { RepSummary } from "../RepSummary";
import { SaveButton } from "../SaveButton";
import { SaveStatusMessage } from "../SaveStatusMessage";
import { Section } from "../Section";
import { SessionFileInput } from "../SessionFileInput";

interface NewSessionSectionProps {
  token: string;
  onSaved: () => Promise<void>;
}

export function NewSessionSection({ token, onSaved }: NewSessionSectionProps) {
  const { draft, error: fileError, loadFile } = useSessionDraft();
  const { status, saving, save, resetStatus } = useSaveSession(token, draft, onSaved);

  async function handleFile(file: File | undefined) {
    resetStatus();
    await loadFile(file);
  }

  return (
    <Section title={TEXT.NEW_SESSION}>
      <SessionFileInput onFile={(file) => void handleFile(file)} />
      <div aria-live="polite">
        {fileError && <ErrorText message={fileError} />}
        {draft && (
          <>
            <RepSummary draft={draft} />
            <AngleChart angles={draft.angles} />
            <SaveButton saving={saving} isRetry={status !== null && !status.ok} onClick={() => void save()} />
          </>
        )}
        {status && <SaveStatusMessage status={status} />}
      </div>
    </Section>
  );
}
