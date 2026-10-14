import type { ChartScale } from "../../lib/chartScale";

const LABEL_OFFSET = { x: 4, y: 4 };

interface ThresholdLineProps {
  angle: number;
  scale: ChartScale;
}

export function ThresholdLine({ angle, scale }: ThresholdLineProps) {
  const y = scale.yAt(angle);
  return (
    <g>
      <line x1={scale.left} x2={scale.right} y1={y} y2={y} className="threshold" />
      <text x={scale.left - LABEL_OFFSET.x} y={y + LABEL_OFFSET.y} textAnchor="end" className="tick">
        {angle}°
      </text>
    </g>
  );
}
