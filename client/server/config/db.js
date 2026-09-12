import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getDatabaseUrl } from "./environment.js";

const globalForPrisma = globalThis;

const createPrisma = () => new PrismaClient({
  adapter: new PrismaPg({
    connectionString: getDatabaseUrl(),
    max: 5,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
  }),
});

const prisma = globalForPrisma.prisma ?? createPrisma();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
