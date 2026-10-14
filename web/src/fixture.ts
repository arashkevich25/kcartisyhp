import { fixtureSchema, type Fixture } from "@rep/shared";
import { ERRORS, FixtureParseError } from "./common";

export function parseFixture(text: string): Fixture {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new FixtureParseError(ERRORS.INVALID_JSON);
  }
  const result = fixtureSchema.safeParse(json);
  if (!result.success) throw new FixtureParseError(ERRORS.INVALID_FIXTURE);
  return result.data;
}
