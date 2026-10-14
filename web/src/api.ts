import { AUTH_SCHEME, SESSIONS_PATH, type Session, type SessionInput } from "@rep/shared";
import { ApiError, ERRORS, JSON_CONTENT_TYPE, NETWORK_ERROR_STATUS } from "./common";

async function request<T>(token: string, path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      ...init,
      headers: {
        ...(init?.body ? { "content-type": JSON_CONTENT_TYPE } : {}),
        authorization: `${AUTH_SCHEME} ${token}`,
      },
    });
  } catch {
    throw new ApiError(NETWORK_ERROR_STATUS, ERRORS.SERVER_UNREACHABLE);
  }
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new ApiError(response.status, body?.error ?? ERRORS.requestFailed(response.status));
  }
  return (await response.json()) as T;
}

export const listSessions = (token: string) => request<Session[]>(token, SESSIONS_PATH);

// Only the result is sent; the angles never leave the browser.
export const saveSession = (token: string, input: SessionInput) =>
  request<Session>(token, SESSIONS_PATH, { method: "POST", body: JSON.stringify(input) });
