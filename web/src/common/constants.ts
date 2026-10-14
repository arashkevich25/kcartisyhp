import { DEMO_USERS } from "@rep/shared";

export const USERS = DEMO_USERS;

export const TEXT = {
  TITLE: "Rep Counter",
  PATIENT_LABEL: "Patient",
  NEW_SESSION: "New session",
  SESSION_FILE_LABEL: "Session file",
  SAVE_RESULT: "Save result",
  SAVING: "Saving…",
  RETRY: "Retry",
  SAVED: "Saved",
  HISTORY: "History",
  LOADING: "Loading…",
  NO_SESSIONS: "No sessions yet.",
  COLUMN_WHEN: "When",
  COLUMN_REPS: "Reps",
  COLUMN_DURATION: "Duration",
  REPS_UNIT: "reps in",
  SECONDS_UNIT: "s",
} as const;

export const ERRORS = {
  LOAD_SESSIONS_FAILED: "Failed to load sessions",
  READ_FILE_FAILED: "Could not read file",
  SAVE_FAILED: "Save failed",
  SERVER_UNREACHABLE: "Cannot reach the server",
  INVALID_JSON: "File is not valid JSON",
  INVALID_FIXTURE: "Not a session file: need sampleRateHz > 0 and a non-empty angles array",
  requestFailed: (status: number) => `Request failed (${status})`,
} as const;

export const FILE_INPUT_ACCEPT = "application/json,.json";
export const JSON_CONTENT_TYPE = "application/json";
export const DURATION_DECIMALS = 2;
export const NETWORK_ERROR_STATUS = 0;
