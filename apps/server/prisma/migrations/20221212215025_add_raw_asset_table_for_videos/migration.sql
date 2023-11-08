-- CreateEnum
CREATE TYPE "StoragePlatforms" AS ENUM ('s3', 'local');

-- CreateTable
CREATE TABLE "RawAsset" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "platform" "StoragePlatforms" NOT NULL,

    CONSTRAINT "RawAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RawAsset_videoId_key" ON "RawAsset"("videoId");

-- AddForeignKey
ALTER TABLE "RawAsset" ADD CONSTRAINT "RawAsset_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- create a RawAsset for each existing video, with the same id as the video
INSERT INTO "RawAsset" ("id", "videoId", "platform") 
SELECT "id", "id", 's3' FROM "Video";