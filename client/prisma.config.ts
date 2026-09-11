import { defineConfig } from "prisma/config";
import { databaseUrl } from "./server/config/environment.js";

export default defineConfig({
  schema: "server/prisma/schema.prisma",
  migrations: { path: "server/prisma/migrations" },
  datasource: { url: databaseUrl },
});
