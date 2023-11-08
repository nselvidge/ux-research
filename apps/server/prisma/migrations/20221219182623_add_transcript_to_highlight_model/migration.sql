/*
  Warnings:

  - A unique constraint covering the columns `[transcriptId]` on the table `Highlight` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Highlight" ADD COLUMN     "transcriptId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Highlight_transcriptId_key" ON "Highlight"("transcriptId");

-- AddForeignKey
ALTER TABLE "Highlight" ADD CONSTRAINT "Highlight_transcriptId_fkey" FOREIGN KEY ("transcriptId") REFERENCES "Transcript"("id") ON DELETE SET NULL ON UPDATE CASCADE;
