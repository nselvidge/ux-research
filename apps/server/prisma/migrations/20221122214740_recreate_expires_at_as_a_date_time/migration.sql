/*
  Warnings:

  - The `expiresAt` column on the `ExternalAuth` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ExternalAuth" DROP COLUMN "expiresAt",
ADD COLUMN     "expiresAt" TIMESTAMP(3);
