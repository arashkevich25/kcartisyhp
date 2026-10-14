import { TEXT, USERS } from "../../common";

interface PatientSelectProps {
  token: string;
  onChange: (token: string) => void;
}

export function PatientSelect({ token, onChange }: PatientSelectProps) {
  return (
    <label>
      {TEXT.PATIENT_LABEL}{" "}
      <select value={token} onChange={(event) => onChange(event.target.value)}>
        {USERS.map((user) => (
          <option key={user.token} value={user.token}>
            {user.name}
          </option>
        ))}
      </select>
    </label>
  );
}
