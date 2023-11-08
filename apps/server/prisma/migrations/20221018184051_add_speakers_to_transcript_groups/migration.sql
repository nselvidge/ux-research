/*
  Warnings:

  - Added the required column `speakerId` to the `TranscriptGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TranscriptGroup" ADD COLUMN "speakerId" TEXT;


CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

UPDATE "TranscriptGroup" AS a SET "speakerId" = b."id" 
FROM (
	SELECT  
		uuid_generate_v4() AS "id", 
		"speaker", 
		"transcriptId" 
	FROM "TranscriptGroup" 
	GROUP BY "transcriptId", "speaker"
) AS b
WHERE b."speaker" = a."speaker" AND b."transcriptId" = a."transcriptId";

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

INSERT INTO "Participant" ("id", "name")
SELECT  "speakerId" AS "id", "speaker" AS "name" FROM "TranscriptGroup" GROUP BY "speakerId", "speaker";

ALTER TABLE "TranscriptGroup" ALTER COLUMN "speakerId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "TranscriptGroup" ADD CONSTRAINT "TranscriptGroup_speakerId_fkey" FOREIGN KEY ("speakerId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
