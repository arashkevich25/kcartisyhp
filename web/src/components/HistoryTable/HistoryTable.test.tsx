import { render, screen } from "@testing-library/react";
import { TEXT } from "../../common";
import { HistoryTable } from "./HistoryTable";

const sessions = [
  { sessionId: "s1", reps: 8, durationSec: 27.6, performedAt: "2026-02-01T10:00:00.000Z" },
  { sessionId: "s2", reps: 10, durationSec: 36.3, performedAt: "2026-01-01T10:00:00.000Z" },
];

describe("HistoryTable", () => {
  it("has the column headers", () => {
    render(<HistoryTable sessions={sessions} />);
    expect(screen.getAllByRole("columnheader").map((header) => header.textContent)).toEqual([
      TEXT.COLUMN_WHEN,
      TEXT.COLUMN_REPS,
      TEXT.COLUMN_DURATION,
    ]);
  });

  it("renders one row per session, in the given order", () => {
    render(<HistoryTable sessions={sessions} />);
    const rows = screen.getAllByRole("row").slice(1);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent("8");
    expect(rows[1]).toHaveTextContent("10");
  });
});
