import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const serverDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// Shell/Vercel variables take precedence, followed by the project .env.
dotenv.config({ path: path.resolve(serverDirectory, "..", ".env") });
dotenv.config({ path: path.join(serverDirectory, ".env") });

export function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url || !/^postgres(ql)?:\/\//.test(url)) {
    throw new Error("Set DATABASE_URL to your Supabase PostgreSQL connection string in client/.env or the deployment environment.");
  }
  return url;
}
