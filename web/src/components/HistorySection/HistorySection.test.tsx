import { render, screen } from "@testing-library/react";
import { TEXT } from "../../common";
import { HistorySection } from "./HistorySection";

const session = { sessionId: "s1", reps: 8, durationSec: 27.6, performedAt: "2026-01-01T10:00:00.000Z" };

describe("HistorySection", () => {
  it("shows loading while sessions are null", () => {
    render(<HistorySection sessions={null} error={null} />);
    expect(screen.getByText(TEXT.LOADING)).toBeInTheDocument();
  });

  it("shows an empty message", () => {
    render(<HistorySection sessions={[]} error={null} />);
    expect(screen.getByText(TEXT.NO_SESSIONS)).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("shows the table when there are sessions", () => {
    render(<HistorySection sessions={[session]} error={null} />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.queryByText(TEXT.NO_SESSIONS)).not.toBeInTheDocument();
  });

  it("shows an error", () => {
    render(<HistorySection sessions={[]} error="Cannot reach the server" />);
    expect(screen.getByText("Cannot reach the server")).toHaveClass("error");
  });
});
