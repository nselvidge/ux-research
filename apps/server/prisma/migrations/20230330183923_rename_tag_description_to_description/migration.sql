/*
  Warnings:

  - You are about to drop the column `tagDescription` on the `Tag` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "tagDescription",
ADD COLUMN     "description" TEXT;
