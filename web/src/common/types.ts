import type { SessionInput } from "@rep/shared";

export interface SessionDraft {
  fileName: string;
  angles: number[];
  input: SessionInput;
}

export interface SaveStatus {
  ok: boolean;
  text: string;
}
