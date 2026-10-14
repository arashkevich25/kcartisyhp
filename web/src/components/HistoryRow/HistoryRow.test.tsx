import { render, screen } from "@testing-library/react";
import { HistoryRow } from "./HistoryRow";

const session = { sessionId: "s1", reps: 8, durationSec: 27.6, performedAt: "2026-01-01T10:00:00.000Z" };

describe("HistoryRow", () => {
  it("renders date, reps and duration cells", () => {
    render(
      <table>
        <tbody>
          <HistoryRow session={session} />
        </tbody>
      </table>,
    );
    const cells = screen.getAllByRole("cell");
    expect(cells[0]).toHaveTextContent(new Date(session.performedAt).toLocaleString());
    expect(cells[1]).toHaveTextContent("8");
    expect(cells[2]).toHaveTextContent("27.6s");
  });
});
