import { closeSync, mkdirSync, openSync } from "node:fs";
import path from "node:path";
import { databaseUrl } from "../config/environment.js";

// Ensure a fresh SQLite file exists before invoking the Prisma schema engine on Windows.
// Opening in append mode never truncates an existing database.
const databasePath = databaseUrl.slice(5);
mkdirSync(path.dirname(databasePath), { recursive: true });
closeSync(openSync(databasePath, "a"));
