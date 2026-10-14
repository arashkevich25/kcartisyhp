import { useCallback, useEffect, useState } from "react";
import { saveSession } from "../api";
import { ApiError, ERRORS, type SaveStatus, type SessionDraft, TEXT } from "../common";

export function useSaveSession(token: string, draft: SessionDraft | null, onSaved: () => Promise<void>) {
  const [status, setStatus] = useState<SaveStatus | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => setStatus(null), [token]);
  const resetStatus = useCallback(() => setStatus(null), []);

  async function save() {
    if (!draft) return;
    setSaving(true);
    setStatus(null);
    try {
      // Retrying after a failure reuses the same sessionId, so the server saves it once.
      await saveSession(token, draft.input);
      setStatus({ ok: true, text: TEXT.SAVED });
      await onSaved();
    } catch (caught) {
      setStatus({ ok: false, text: caught instanceof ApiError ? caught.message : ERRORS.SAVE_FAILED });
    } finally {
      setSaving(false);
    }
  }

  return { status, saving, save, resetStatus };
}
