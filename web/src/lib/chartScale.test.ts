import { CHART_HEIGHT, CHART_WIDTH, createChartScale } from "./chartScale";

describe("createChartScale", () => {
  it("maps the first and last sample to the left and right edges of the plot", () => {
    const scale = createChartScale([170, 90, 170]);
    expect(scale.xAt(0)).toBe(scale.left);
    expect(scale.xAt(2)).toBe(scale.right);
  });

  it("puts higher angles higher on the chart (smaller y)", () => {
    const scale = createChartScale([170, 90]);
    expect(scale.yAt(170)).toBeLessThan(scale.yAt(90));
  });

  it("keeps values outside the default range inside the chart", () => {
    const scale = createChartScale([60, 200]);
    for (const angle of [60, 200]) {
      expect(scale.yAt(angle)).toBeGreaterThanOrEqual(0);
      expect(scale.yAt(angle)).toBeLessThanOrEqual(CHART_HEIGHT);
    }
    expect(scale.right).toBeLessThanOrEqual(CHART_WIDTH);
  });

  it("does not divide by zero for a single sample", () => {
    expect(Number.isFinite(createChartScale([170]).xAt(0))).toBe(true);
  });
});
