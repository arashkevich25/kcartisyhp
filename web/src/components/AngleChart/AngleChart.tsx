import { BOTTOM_THRESHOLD_DEG, TOP_THRESHOLD_DEG } from "@rep/shared";
import { CHART_HEIGHT, CHART_WIDTH, createChartScale } from "../../lib/chartScale";
import { ThresholdLine } from "../ThresholdLine";

interface AngleChartProps {
  angles: readonly number[];
}

export function AngleChart({ angles }: AngleChartProps) {
  const scale = createChartScale(angles);
  const points = angles.map((angle, index) => `${scale.xAt(index).toFixed(1)},${scale.yAt(angle).toFixed(1)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} role="img" aria-label="Knee angle over time with rep thresholds">
      <ThresholdLine angle={TOP_THRESHOLD_DEG} scale={scale} />
      <ThresholdLine angle={BOTTOM_THRESHOLD_DEG} scale={scale} />
      <polyline points={points} className="signal" />
    </svg>
  );
}
