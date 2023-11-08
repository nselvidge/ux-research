/*
  Warnings:

  - The values [pending] on the enum `EditableAssetStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EditableAssetStatus_new" AS ENUM ('processing', 'completed');
ALTER TABLE "EditableAsset" ALTER COLUMN "status" TYPE "EditableAssetStatus_new" USING ("status"::text::"EditableAssetStatus_new");
ALTER TYPE "EditableAssetStatus" RENAME TO "EditableAssetStatus_old";
ALTER TYPE "EditableAssetStatus_new" RENAME TO "EditableAssetStatus";
DROP TYPE "EditableAssetStatus_old";
COMMIT;
