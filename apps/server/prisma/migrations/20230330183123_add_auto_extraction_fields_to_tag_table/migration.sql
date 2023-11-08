-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "autoExtract" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tagDescription" TEXT;
