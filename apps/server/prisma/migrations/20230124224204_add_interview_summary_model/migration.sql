-- CreateTable
CREATE TABLE "InterviewSummary" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,

    CONSTRAINT "InterviewSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InterviewSummary_interviewId_key" ON "InterviewSummary"("interviewId");

-- AddForeignKey
ALTER TABLE "InterviewSummary" ADD CONSTRAINT "InterviewSummary_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
