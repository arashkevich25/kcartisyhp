import { TEXT } from "../../common";

interface DurationProps {
  seconds: number;
}

export function Duration({ seconds }: DurationProps) {
  return <>{`${seconds}${TEXT.SECONDS_UNIT}`}</>;
}
