import type { SaveStatus } from "../../common";

interface SaveStatusMessageProps {
  status: SaveStatus;
}

export function SaveStatusMessage({ status }: SaveStatusMessageProps) {
  return <p className={status.ok ? "ok" : "error"}>{status.text}</p>;
}
