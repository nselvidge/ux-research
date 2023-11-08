/*
  Warnings:

  - A unique constraint covering the columns `[videoId]` on the table `Highlight` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Highlight" ADD COLUMN     "videoId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Highlight_videoId_key" ON "Highlight"("videoId");

-- AddForeignKey
ALTER TABLE "Highlight" ADD CONSTRAINT "Highlight_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE SET NULL ON UPDATE CASCADE;
