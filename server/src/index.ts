import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { buildApp } from "./app";
import { SERVER_DEFAULTS } from "./constants";
import { SqliteSessionRepository } from "./repositories";

const host = SERVER_DEFAULTS.HOST;
const port = Number(process.env.PORT ?? SERVER_DEFAULTS.PORT);

const dbFile = process.env.DB_FILE ?? SERVER_DEFAULTS.DB_FILE;
mkdirSync(dirname(dbFile), { recursive: true });
const app = buildApp(new SqliteSessionRepository(dbFile));

app.listen({ port, host }).then(
  () => console.log(`API listening on http://${host}:${port}`),
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
