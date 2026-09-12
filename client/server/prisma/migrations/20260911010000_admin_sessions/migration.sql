-- Credential and administrative role changes can revoke existing sessions.
ALTER TABLE "User" ADD COLUMN "tokenVersion" INTEGER NOT NULL DEFAULT 0;
