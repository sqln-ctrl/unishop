import { closeSync, mkdirSync, openSync } from "node:fs";
import path from "node:path";
import { databaseUrl } from "../config/environment.js";

const databasePath = databaseUrl.slice(5);
mkdirSync(path.dirname(databasePath), { recursive: true });
closeSync(openSync(databasePath, "a"));
