export const CHART_WIDTH = 900;
export const CHART_HEIGHT = 220;
const PADDING = { left: 40, right: 10, top: 10, bottom: 20 };
const MIN_VISIBLE_ANGLE = 80;
const MAX_VISIBLE_ANGLE = 180;

export function createChartScale(angles: readonly number[]) {
  const minAngle = Math.min(MIN_VISIBLE_ANGLE, ...angles);
  const maxAngle = Math.max(MAX_VISIBLE_ANGLE, ...angles);
  const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  return {
    left: PADDING.left,
    right: CHART_WIDTH - PADDING.right,
    xAt: (index: number) => PADDING.left + (index / Math.max(1, angles.length - 1)) * plotWidth,
    yAt: (angle: number) => PADDING.top + ((maxAngle - angle) / (maxAngle - minAngle)) * plotHeight,
  };
}

export type ChartScale = ReturnType<typeof createChartScale>;
