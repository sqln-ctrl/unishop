import app from "./app.js";
import prisma from "./config/db.js";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required. Copy .env.example to .env and set a secret.");
}

// Verify both the connection and schema before accepting requests.
try {
  await prisma.$connect();
  await prisma.user.count();
} catch (error) {
  console.error("SQLite startup failed. Check DATABASE_URL and run npm run db:deploy.", error.message);
  await prisma.$disconnect();
  process.exit(1);
}

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT} with SQLite`));

const shutdown = () => {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
