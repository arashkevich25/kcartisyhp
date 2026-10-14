import { render, screen } from "@testing-library/react";
import { createChartScale } from "../../lib/chartScale";
import { ThresholdLine } from "./ThresholdLine";

describe("ThresholdLine", () => {
  it("draws a horizontal line at the angle with its label", () => {
    const scale = createChartScale([170, 90]);
    const { container } = render(
      <svg>
        <ThresholdLine angle={100} scale={scale} />
      </svg>,
    );
    const line = container.querySelector("line")!;
    expect(line).toHaveAttribute("y1", String(scale.yAt(100)));
    expect(line).toHaveAttribute("y2", String(scale.yAt(100)));
    expect(line).toHaveAttribute("x1", String(scale.left));
    expect(line).toHaveAttribute("x2", String(scale.right));
    expect(screen.getByText("100°")).toBeInTheDocument();
  });
});
