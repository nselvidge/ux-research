-- CreateTable
CREATE TABLE "Interview" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recording" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,

    CONSTRAINT "Recording_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transcript" (
    "id" TEXT NOT NULL,
    "version" SERIAL NOT NULL,
    "recordingId" TEXT NOT NULL,
    "isPending" BOOLEAN NOT NULL,

    CONSTRAINT "Transcript_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TranscriptGroup" (
    "transcriptId" TEXT NOT NULL,
    "groupNumber" INTEGER NOT NULL,
    "speaker" TEXT NOT NULL,

    CONSTRAINT "TranscriptGroup_pkey" PRIMARY KEY ("transcriptId","groupNumber")
);

-- CreateTable
CREATE TABLE "TranscriptWord" (
    "transcriptId" TEXT NOT NULL,
    "groupNumber" INTEGER NOT NULL,
    "wordNumber" INTEGER NOT NULL,
    "start" DOUBLE PRECISION NOT NULL,
    "end" DOUBLE PRECISION NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "TranscriptWord_pkey" PRIMARY KEY ("transcriptId","groupNumber","wordNumber")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "session" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recording_interviewId_key" ON "Recording"("interviewId");

-- CreateIndex
CREATE UNIQUE INDEX "Transcript_recordingId_key" ON "Transcript"("recordingId");

-- AddForeignKey
ALTER TABLE "Recording" ADD CONSTRAINT "Recording_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transcript" ADD CONSTRAINT "Transcript_recordingId_fkey" FOREIGN KEY ("recordingId") REFERENCES "Recording"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranscriptGroup" ADD CONSTRAINT "TranscriptGroup_transcriptId_fkey" FOREIGN KEY ("transcriptId") REFERENCES "Transcript"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranscriptWord" ADD CONSTRAINT "TranscriptWord_transcriptId_fkey" FOREIGN KEY ("transcriptId") REFERENCES "Transcript"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranscriptWord" ADD CONSTRAINT "TranscriptWord_transcriptId_groupNumber_fkey" FOREIGN KEY ("transcriptId", "groupNumber") REFERENCES "TranscriptGroup"("transcriptId", "groupNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
