/*
  Warnings:

  - A unique constraint covering the columns `[originSuggestionId]` on the table `Highlight` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Highlight" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "originSuggestionId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Highlight_originSuggestionId_key" ON "Highlight"("originSuggestionId");

-- AddForeignKey
ALTER TABLE "Highlight" ADD CONSTRAINT "Highlight_originSuggestionId_fkey" FOREIGN KEY ("originSuggestionId") REFERENCES "SuggestedHighlight"("id") ON DELETE SET NULL ON UPDATE CASCADE;
