import { BOTTOM_THRESHOLD_DEG, TOP_THRESHOLD_DEG } from "@rep/shared";
import { render, screen } from "@testing-library/react";
import { AngleChart } from "./AngleChart";

describe("AngleChart", () => {
  it("is labelled and draws one point per sample", () => {
    const { container } = render(<AngleChart angles={[170, 120, 90, 170]} />);
    expect(screen.getByRole("img", { name: /knee angle/i })).toBeInTheDocument();
    expect(container.querySelector("polyline")!.getAttribute("points")!.split(" ")).toHaveLength(4);
  });

  it("labels both rep thresholds", () => {
    render(<AngleChart angles={[170, 90]} />);
    expect(screen.getByText(`${TOP_THRESHOLD_DEG}°`)).toBeInTheDocument();
    expect(screen.getByText(`${BOTTOM_THRESHOLD_DEG}°`)).toBeInTheDocument();
  });
});
