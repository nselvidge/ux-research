-- CreateEnum
CREATE TYPE "SuggestedHighlightStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "SuggestedHighlight" (
    "id" TEXT NOT NULL,
    "highlightedRangeId" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "transcriptId" TEXT NOT NULL,
    "status" "SuggestedHighlightStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SuggestedHighlight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SuggestedHighlightToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SuggestedHighlight_highlightedRangeId_key" ON "SuggestedHighlight"("highlightedRangeId");

-- CreateIndex
CREATE UNIQUE INDEX "SuggestedHighlight_transcriptId_key" ON "SuggestedHighlight"("transcriptId");

-- CreateIndex
CREATE UNIQUE INDEX "_SuggestedHighlightToTag_AB_unique" ON "_SuggestedHighlightToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_SuggestedHighlightToTag_B_index" ON "_SuggestedHighlightToTag"("B");

-- AddForeignKey
ALTER TABLE "SuggestedHighlight" ADD CONSTRAINT "SuggestedHighlight_highlightedRangeId_fkey" FOREIGN KEY ("highlightedRangeId") REFERENCES "WordRange"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuggestedHighlight" ADD CONSTRAINT "SuggestedHighlight_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuggestedHighlight" ADD CONSTRAINT "SuggestedHighlight_transcriptId_fkey" FOREIGN KEY ("transcriptId") REFERENCES "Transcript"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SuggestedHighlightToTag" ADD CONSTRAINT "_SuggestedHighlightToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "SuggestedHighlight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SuggestedHighlightToTag" ADD CONSTRAINT "_SuggestedHighlightToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
