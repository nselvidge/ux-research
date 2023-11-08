/*
  Warnings:

  - Made the column `isSigned` on table `EditableAsset` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isSigned` on table `PlayableAsset` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
UPDATE "EditableAsset" SET "isSigned" = false WHERE "isSigned" IS NULL;
ALTER TABLE "EditableAsset" ALTER COLUMN "isSigned" SET NOT NULL,
ALTER COLUMN "isSigned" SET DEFAULT false;

-- AlterTable
UPDATE "PlayableAsset" SET "isSigned" = false WHERE "isSigned" IS NULL;
ALTER TABLE "PlayableAsset" ALTER COLUMN "isSigned" SET NOT NULL,
ALTER COLUMN "isSigned" SET DEFAULT false;
