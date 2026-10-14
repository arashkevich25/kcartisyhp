import { FILE_INPUT_ACCEPT, TEXT } from "../../common";

interface SessionFileInputProps {
  onFile: (file: File | undefined) => void;
}

export function SessionFileInput({ onFile }: SessionFileInputProps) {
  return (
    <label>
      {TEXT.SESSION_FILE_LABEL}{" "}
      <input type="file" accept={FILE_INPUT_ACCEPT} onChange={(event) => onFile(event.target.files?.[0])} />
    </label>
  );
}
