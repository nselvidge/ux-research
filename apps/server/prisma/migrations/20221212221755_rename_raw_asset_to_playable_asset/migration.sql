/*
  Warnings:

  - You are about to drop the `RawAsset` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "StoragePlatforms" ADD VALUE 'mux';

-- DropForeignKey
ALTER TABLE "RawAsset" DROP CONSTRAINT "RawAsset_videoId_fkey";

-- change RawAsset to PlayableAsset
ALTER TABLE "RawAsset" RENAME TO "PlayableAsset";

-- CreateIndex
CREATE UNIQUE INDEX "PlayableAsset_videoId_key" ON "PlayableAsset"("videoId");

-- AddForeignKey
ALTER TABLE "PlayableAsset" ADD CONSTRAINT "PlayableAsset_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
