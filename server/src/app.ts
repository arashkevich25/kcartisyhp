import Fastify from "fastify";
import { SESSIONS_PATH, sessionInputSchema } from "@rep/shared";
import { userIdFromHeader } from "./auth";
import { HTTP_STATUS, REQUEST_USER_ID_KEY } from "./constants";
import { InternalServerError, SessionConflictError, toHttpError, UnauthorizedError, ValidationError } from "./errors";
import type { SessionRepository } from "./repositories";

declare module "fastify" {
  interface FastifyRequest {
    userId: string;
  }
}

export function buildApp(sessions: SessionRepository) {
  const app = Fastify();

  app.setErrorHandler((error, _request, reply) => {
    const httpError = toHttpError(error);
    if (httpError instanceof InternalServerError) app.log.error(error);
    return reply.code(httpError.statusCode).send(httpError.toBody());
  });

  app.decorateRequest(REQUEST_USER_ID_KEY, "");
  app.addHook("preHandler", async (request) => {
    const userId = userIdFromHeader(request.headers.authorization);
    if (!userId) throw new UnauthorizedError();
    request.userId = userId;
  });

  app.post(SESSIONS_PATH, async (request, reply) => {
    const parsed = sessionInputSchema.safeParse(request.body);
    if (!parsed.success) throw new ValidationError(parsed.error.issues);

    const { session, created } = sessions.save(request.userId, parsed.data);
    if (created) return reply.code(HTTP_STATUS.CREATED).send(session);

    // Same sessionId again: a retry returns the stored record; different data is a client bug.
    const isSameData =
      session.reps === parsed.data.reps &&
      session.durationSec === parsed.data.durationSec &&
      session.performedAt === parsed.data.performedAt;
    if (!isSameData) throw new SessionConflictError();
    return reply.code(HTTP_STATUS.OK).send(session);
  });

  app.get(SESSIONS_PATH, async (request) => sessions.listByUser(request.userId));

  return app;
}
