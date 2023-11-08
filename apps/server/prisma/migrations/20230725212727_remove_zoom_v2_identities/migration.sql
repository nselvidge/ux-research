/*
  Warnings:

  - The values [zoomV2] on the enum `IdentityType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "IdentityType_new" AS ENUM ('password', 'zoom');
ALTER TABLE "Identity" ALTER COLUMN "type" TYPE "IdentityType_new" USING ("type"::text::"IdentityType_new");
ALTER TYPE "IdentityType" RENAME TO "IdentityType_old";
ALTER TYPE "IdentityType_new" RENAME TO "IdentityType";
DROP TYPE "IdentityType_old";
COMMIT;
