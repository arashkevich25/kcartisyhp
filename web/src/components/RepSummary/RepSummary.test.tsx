import { render, screen } from "@testing-library/react";
import type { SessionDraft } from "../../common";
import { RepSummary } from "./RepSummary";

const draft: SessionDraft = {
  fileName: "session-clean.json",
  angles: [],
  input: { sessionId: "id", reps: 10, durationSec: 36.27, performedAt: "2026-01-01T10:00:00.000Z" },
};

describe("RepSummary", () => {
  it("shows reps, duration and file name", () => {
    const { container } = render(<RepSummary draft={draft} />);
    expect(screen.getByTestId("reps")).toHaveTextContent("10");
    expect(container).toHaveTextContent("36.27s");
    expect(container).toHaveTextContent("session-clean.json");
  });
});
