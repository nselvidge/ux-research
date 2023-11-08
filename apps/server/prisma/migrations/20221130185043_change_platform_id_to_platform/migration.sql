/*
  Warnings:

  - You are about to drop the column `platformId` on the `InterviewSource` table. All the data in the column will be lost.
  - Added the required column `platform` to the `InterviewSource` table without a default value. This is not possible if the table is not empty.

*/

ALTER TABLE "InterviewSource" RENAME COLUMN "platformId" TO "platform";

