-- CreateTable
CREATE TABLE "WordRange" (
    "id" TEXT NOT NULL,
    "transcriptId" TEXT NOT NULL,
    "startWordNumber" INTEGER NOT NULL,
    "startGroupNumber" INTEGER NOT NULL,
    "endWordNumber" INTEGER NOT NULL,
    "endGroupNumber" INTEGER NOT NULL,

    CONSTRAINT "WordRange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Highlight" (
    "id" TEXT NOT NULL,
    "highlightedRangeId" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,

    CONSTRAINT "Highlight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Highlight_highlightedRangeId_key" ON "Highlight"("highlightedRangeId");

-- AddForeignKey
ALTER TABLE "WordRange" ADD CONSTRAINT "WordRange_transcriptId_startGroupNumber_startWordNumber_fkey" FOREIGN KEY ("transcriptId", "startGroupNumber", "startWordNumber") REFERENCES "TranscriptWord"("transcriptId", "groupNumber", "wordNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordRange" ADD CONSTRAINT "WordRange_transcriptId_endGroupNumber_endWordNumber_fkey" FOREIGN KEY ("transcriptId", "endGroupNumber", "endWordNumber") REFERENCES "TranscriptWord"("transcriptId", "groupNumber", "wordNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Highlight" ADD CONSTRAINT "Highlight_highlightedRangeId_fkey" FOREIGN KEY ("highlightedRangeId") REFERENCES "WordRange"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Highlight" ADD CONSTRAINT "Highlight_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
