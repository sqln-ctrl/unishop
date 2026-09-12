import { defineConfig } from "prisma/config";
import "./server/config/environment.js";

export default defineConfig({
  schema: "server/prisma/schema.prisma",
  migrations: { path: "server/prisma/migrations" },
  // Migrations use the session pooler (5432) or a direct connection.
  // Reading process.env allows client generation before secrets are configured.
  datasource: { url: process.env.DIRECT_URL },
});
