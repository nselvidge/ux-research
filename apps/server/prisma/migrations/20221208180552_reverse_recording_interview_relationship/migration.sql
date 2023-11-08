ALTER TABLE "Recording" DROP CONSTRAINT "Recording_interviewId_fkey";

DROP INDEX "Recording_interviewId_key";

ALTER TABLE "Interview" ADD COLUMN "recordingId" TEXT;

-- write a query that sets "interview"."recordingId" to the "recording"."id" of the recording with the same "interviewId" as the interview
UPDATE "Interview" SET "recordingId" = "Recording"."id" FROM "Recording" WHERE "Interview"."id" = "Recording"."interviewId";

ALTER TABLE "Recording" DROP COLUMN "interviewId";

CREATE UNIQUE INDEX "Interview_recordingId_key" ON "Interview"("recordingId");

ALTER TABLE "Interview" ADD CONSTRAINT "Interview_recordingId_fkey" FOREIGN KEY ("recordingId") REFERENCES "Recording"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
