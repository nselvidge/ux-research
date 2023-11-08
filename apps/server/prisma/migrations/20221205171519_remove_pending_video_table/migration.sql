/*
  Warnings:

  - You are about to drop the `PendingVideo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PendingVideo" DROP CONSTRAINT "PendingVideo_interviewId_fkey";

-- DropForeignKey
ALTER TABLE "PendingVideo" DROP CONSTRAINT "PendingVideo_userId_fkey";

-- DropTable
DROP TABLE "PendingVideo";
