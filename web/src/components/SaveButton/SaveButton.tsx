import { TEXT } from "../../common";

interface SaveButtonProps {
  saving: boolean;
  isRetry: boolean;
  onClick: () => void;
}

export function SaveButton({ saving, isRetry, onClick }: SaveButtonProps) {
  const label = saving ? TEXT.SAVING : isRetry ? TEXT.RETRY : TEXT.SAVE_RESULT;
  return (
    <button onClick={onClick} disabled={saving}>
      {label}
    </button>
  );
}
