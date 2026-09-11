import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { databaseUrl } from "./environment.js";

const globalForPrisma = globalThis;

const createPrisma = () => new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: databaseUrl }) });

const prisma = globalForPrisma.prisma ?? createPrisma();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
