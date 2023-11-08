-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_recordingId_fkey";

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_recordingId_fkey" FOREIGN KEY ("recordingId") REFERENCES "Recording"("id") ON DELETE SET NULL ON UPDATE CASCADE;
