export const BOTTOM_THRESHOLD_DEG = 100;
export const TOP_THRESHOLD_DEG = 160;

export function countReps(angles: readonly number[]): number {
  let reps = 0;
  let down = false;
  for (const angle of angles) {
    if (!Number.isFinite(angle)) continue;
    if (!down && angle < BOTTOM_THRESHOLD_DEG) {
      down = true;
    } else if (down && angle > TOP_THRESHOLD_DEG) {
      down = false;
      reps++;
    }
  }
  return reps;
}
