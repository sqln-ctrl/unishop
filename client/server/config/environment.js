import dotenv from "dotenv";
import { copyFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const serverDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.join(serverDirectory, ".env") });

const configuredUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
if (!configuredUrl.startsWith("file:")) {
  throw new Error("DATABASE_URL must be a local SQLite URL starting with file:");
}
const databasePath = path.resolve(serverDirectory, configuredUrl.slice(5));
const templatePath = path.join(serverDirectory, "prisma", "dev.db");

// Vercel functions may write only to /tmp. Seed each cold instance from the
// migrated template produced during the Vercel build; its data is ephemeral.
if (databasePath.startsWith("/tmp/") && !existsSync(/*turbopackIgnore: true*/ databasePath) && existsSync(/*turbopackIgnore: true*/ templatePath)) {
  copyFileSync(templatePath, databasePath);
}

export const databaseUrl = `file:${databasePath.replaceAll("\\", "/")}`;
