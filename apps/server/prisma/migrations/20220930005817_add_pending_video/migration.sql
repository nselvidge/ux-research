-- CreateTable
CREATE TABLE "PendingVideo" (
    "interviewId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PendingVideo_pkey" PRIMARY KEY ("interviewId","externalId")
);

-- AddForeignKey
ALTER TABLE "PendingVideo" ADD CONSTRAINT "PendingVideo_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingVideo" ADD CONSTRAINT "PendingVideo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
