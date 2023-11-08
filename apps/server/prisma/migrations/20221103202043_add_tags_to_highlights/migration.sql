-- CreateTable
CREATE TABLE "_HighlightToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_HighlightToTag_AB_unique" ON "_HighlightToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_HighlightToTag_B_index" ON "_HighlightToTag"("B");

-- AddForeignKey
ALTER TABLE "_HighlightToTag" ADD CONSTRAINT "_HighlightToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Highlight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HighlightToTag" ADD CONSTRAINT "_HighlightToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
