import { ERROR_MESSAGES, HTTP_STATUS } from "./constants";

export abstract class HttpError extends Error {
  abstract readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }

  toBody(): { error: string } {
    return { error: this.message };
  }
}

export class UnauthorizedError extends HttpError {
  readonly statusCode = HTTP_STATUS.UNAUTHORIZED;

  constructor() {
    super(ERROR_MESSAGES.INVALID_TOKEN);
  }
}

export class ValidationError extends HttpError {
  readonly statusCode = HTTP_STATUS.BAD_REQUEST;

  constructor(public readonly details: unknown) {
    super(ERROR_MESSAGES.INVALID_SESSION);
  }

  override toBody() {
    return { ...super.toBody(), details: this.details };
  }
}

export class SessionConflictError extends HttpError {
  readonly statusCode = HTTP_STATUS.CONFLICT;

  constructor() {
    super(ERROR_MESSAGES.SESSION_ID_CONFLICT);
  }
}

/** A 4xx raised by the framework itself, for example malformed JSON. */
export class BadRequestError extends HttpError {
  constructor(
    readonly statusCode: number,
    message: string,
  ) {
    super(message);
  }
}

export class InternalServerError extends HttpError {
  readonly statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;

  constructor() {
    super(ERROR_MESSAGES.INTERNAL);
  }
}

function isClientError(error: unknown): error is Error & { statusCode: number } {
  return (
    error instanceof Error &&
    "statusCode" in error &&
    typeof error.statusCode === "number" &&
    error.statusCode >= HTTP_STATUS.BAD_REQUEST &&
    error.statusCode < HTTP_STATUS.INTERNAL_SERVER_ERROR
  );
}

export function toHttpError(error: unknown): HttpError {
  if (error instanceof HttpError) return error;
  if (isClientError(error)) return new BadRequestError(error.statusCode, error.message);
  return new InternalServerError();
}
