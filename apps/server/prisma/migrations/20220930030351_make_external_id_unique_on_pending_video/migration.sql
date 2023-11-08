/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `PendingVideo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PendingVideo_externalId_key" ON "PendingVideo"("externalId");
