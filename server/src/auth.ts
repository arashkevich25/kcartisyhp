import { AUTH_SCHEME, DEMO_USERS } from "@rep/shared";

const USER_ID_BY_TOKEN: ReadonlyMap<string, string> = new Map(DEMO_USERS.map((user) => [user.token, user.id]));
const AUTH_HEADER_PATTERN = new RegExp(`^${AUTH_SCHEME} (.+)$`);

export function userIdFromHeader(header: string | undefined): string | null {
  const token = AUTH_HEADER_PATTERN.exec(header ?? "")?.[1];
  return (token && USER_ID_BY_TOKEN.get(token)) || null;
}
