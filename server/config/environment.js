import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const serverDirectory = fileURLToPath(new URL("../", import.meta.url));
dotenv.config({ path: path.join(serverDirectory, ".env") });

// Share the same absolute database path between the CLI and application.
const configuredUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
if (!configuredUrl.startsWith("file:")) {
  throw new Error("DATABASE_URL must be a local SQLite URL starting with file:");
}
export const databaseUrl = `file:${path.resolve(serverDirectory, configuredUrl.slice(5)).replaceAll("\\", "/")}`;
