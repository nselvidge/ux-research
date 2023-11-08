-- AlterTable
ALTER TABLE "User" ADD COLUMN     "confirmed" BOOLEAN NOT NULL DEFAULT false;

-- set all users to confirmed
UPDATE "User" SET "confirmed" = true;
