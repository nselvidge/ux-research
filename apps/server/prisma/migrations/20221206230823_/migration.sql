
ALTER TABLE "Transcript" DROP CONSTRAINT "Transcript_recordingId_fkey";


DROP INDEX "Transcript_recordingId_key";

ALTER TABLE "Transcript" ADD COLUMN "interviewId" TEXT;

UPDATE "Transcript" SET "interviewId" = "Recording"."interviewId" FROM "Recording" WHERE "Transcript"."recordingId" = "Recording"."id";

ALTER TABLE "Transcript" ALTER COLUMN "interviewId" SET NOT NULL;

ALTER TABLE "Transcript" DROP COLUMN "recordingId";

CREATE UNIQUE INDEX "Transcript_interviewId_key" ON "Transcript"("interviewId");

ALTER TABLE "Transcript" ADD CONSTRAINT "Transcript_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
