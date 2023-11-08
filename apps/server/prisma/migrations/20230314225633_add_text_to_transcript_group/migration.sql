/*
  Warnings:

  - Added the required column `text` to the `TranscriptGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TranscriptGroup" ADD COLUMN     "text" TEXT;

-- Populate the new `text` column with concatenated words from the `TranscriptWord` table
UPDATE "TranscriptGroup" tg
SET "text" = (
  SELECT STRING_AGG(tw."text", ' ' ORDER BY tw."wordNumber")
  FROM "TranscriptWord" tw
  WHERE tw."transcriptId" = tg."transcriptId" AND tw."groupNumber" = tg."groupNumber"
);

-- Make the `text` column non-nullable
ALTER TABLE "TranscriptGroup" ALTER COLUMN "text" SET NOT NULL;
