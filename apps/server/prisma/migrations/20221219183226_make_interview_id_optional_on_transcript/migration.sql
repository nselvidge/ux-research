-- DropForeignKey
ALTER TABLE "Transcript" DROP CONSTRAINT "Transcript_interviewId_fkey";

-- AlterTable
ALTER TABLE "Transcript" ALTER COLUMN "interviewId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transcript" ADD CONSTRAINT "Transcript_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE SET NULL ON UPDATE CASCADE;
