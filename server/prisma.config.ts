import { defineConfig } from "prisma/config";
import { databaseUrl } from "./config/environment.js";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: databaseUrl },
});
