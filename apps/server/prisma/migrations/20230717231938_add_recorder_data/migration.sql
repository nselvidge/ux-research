-- CreateEnum
CREATE TYPE "RecorderType" AS ENUM ('recall');

-- CreateEnum
CREATE TYPE "RecordingTargetType" AS ENUM ('zoom');

-- CreateEnum
CREATE TYPE "RecorderStatus" AS ENUM ('pending', 'recording', 'done');

-- AlterEnum
ALTER TYPE "InterviewSourcePlatforms" ADD VALUE 'recall';

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "recorderId" TEXT;

-- CreateTable
CREATE TABLE "Recorder" (
    "id" TEXT NOT NULL,
    "externalId" TEXT,
    "error" TEXT,
    "type" "RecorderType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "RecorderStatus" NOT NULL,

    CONSTRAINT "Recorder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecordingTarget" (
    "id" TEXT NOT NULL,
    "type" "RecordingTargetType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecordingTarget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recorder_externalId_key" ON "Recorder"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Recorder_targetId_key" ON "Recorder"("targetId");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_recorderId_fkey" FOREIGN KEY ("recorderId") REFERENCES "Recorder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recorder" ADD CONSTRAINT "Recorder_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "RecordingTarget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
