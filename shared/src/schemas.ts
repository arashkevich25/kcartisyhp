import { z } from "zod";

export const fixtureSchema = z.object({
  description: z.string().optional(),
  expectedReps: z.number().int().nonnegative().optional(),
  sampleRateHz: z.number().positive(),
  angles: z.array(z.number().finite()).min(1),
});
export type Fixture = z.infer<typeof fixtureSchema>;

export const sessionInputSchema = z.object({
  sessionId: z.string().min(1).max(100),
  reps: z.number().int().nonnegative(),
  durationSec: z.number().finite().nonnegative(),
  performedAt: z
    .string()
    .datetime({ offset: true })
    .transform((value) => new Date(value).toISOString()),
});
export type SessionInput = z.infer<typeof sessionInputSchema>;

export type Session = SessionInput;
