/*
  Warnings:

  - A unique constraint covering the columns `[userId,tagId]` on the table `UserTagOrder` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserTagOrder_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "UserTagOrder_userId_tagId_key" ON "UserTagOrder"("userId", "tagId");
