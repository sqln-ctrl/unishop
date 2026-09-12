import prisma from "../config/db.js";
import { bootstrapAdmin } from "../utils/bootstrapAdmin.js";

try {
  console.log(await bootstrapAdmin(prisma));
} catch (error) {
  console.error("Admin setup failed:", error.code || error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
