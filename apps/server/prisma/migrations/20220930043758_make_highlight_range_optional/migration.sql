-- DropForeignKey
ALTER TABLE "Highlight" DROP CONSTRAINT "Highlight_highlightedRangeId_fkey";

-- AlterTable
ALTER TABLE "Highlight" ADD COLUMN     "timestamp" INTEGER,
ALTER COLUMN "highlightedRangeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Highlight" ADD CONSTRAINT "Highlight_highlightedRangeId_fkey" FOREIGN KEY ("highlightedRangeId") REFERENCES "WordRange"("id") ON DELETE SET NULL ON UPDATE CASCADE;
