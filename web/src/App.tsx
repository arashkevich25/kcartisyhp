import { useState } from "react";
import { TEXT, USERS } from "./common";
import { HistorySection } from "./components/HistorySection";
import { NewSessionSection } from "./components/NewSessionSection";
import { PatientSelect } from "./components/PatientSelect";
import { useSessions } from "./hooks/useSessions";

export function App() {
  const [token, setToken] = useState<string>(USERS[0].token);
  const { sessions, error, reload } = useSessions(token);

  return (
    <main>
      <h1>{TEXT.TITLE}</h1>
      <PatientSelect token={token} onChange={setToken} />
      <NewSessionSection key={token} token={token} onSaved={reload} />
      <HistorySection sessions={sessions} error={error} />
    </main>
  );
}
