-- CreateEnum
CREATE TYPE "EditableAssetStatus" AS ENUM ('pending', 'completed');

-- CreateTable
CREATE TABLE "EditableAsset" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "status" "EditableAssetStatus" NOT NULL,
    "playbackId" TEXT NOT NULL,

    CONSTRAINT "EditableAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EditableAsset_videoId_key" ON "EditableAsset"("videoId");

-- AddForeignKey
ALTER TABLE "EditableAsset" ADD CONSTRAINT "EditableAsset_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
