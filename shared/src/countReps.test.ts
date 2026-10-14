import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { countReps } from "./countReps";
import { fixtureSchema } from "./schemas";

const load = (name: string) =>
  fixtureSchema.parse(
    JSON.parse(readFileSync(new URL(`../../fixtures/${name}`, import.meta.url), "utf8")),
  );

describe("countReps on fixtures", () => {
  for (const name of ["session-clean.json", "session-noisy.json", "session-shallow.json"]) {
    it(`${name} matches expectedReps`, () => {
      const fixture = load(name);
      expect(fixture.expectedReps).toBeDefined();
      expect(countReps(fixture.angles)).toBe(fixture.expectedReps);
    });
  }
});

describe("countReps edge cases", () => {
  it("returns 0 for empty input", () => expect(countReps([])).toBe(0));
  it("counts one full squat", () => expect(countReps([172, 120, 95, 120, 172])).toBe(1));
  it("ignores a squat that never goes below 100", () =>
    expect(countReps([172, 110, 100, 110, 172])).toBe(0));
  it("does not count a squat that never returns above 160", () =>
    expect(countReps([172, 90, 150, 160])).toBe(0));
  it("does not double count wobble around the thresholds", () =>
    expect(countReps([172, 99, 101, 99, 101, 161, 159, 161, 172])).toBe(1));
  it("counts consecutive reps", () =>
    expect(countReps([90, 170, 90, 170, 90])).toBe(2));
  it("skips non-finite values", () => expect(countReps([172, 90, NaN, 170])).toBe(1));
});
