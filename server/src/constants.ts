export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  INVALID_TOKEN: "Missing or invalid token",
  INVALID_SESSION: "Invalid session",
  SESSION_ID_CONFLICT: "sessionId already used with different data",
  INTERNAL: "Internal server error",
} as const;

export const SERVER_DEFAULTS = {
  HOST: "127.0.0.1",
  PORT: 3001,
  DB_FILE: "data/sessions.db",
} as const;

// Must match the property declared on FastifyRequest in app.ts.
export const REQUEST_USER_ID_KEY = "userId";
