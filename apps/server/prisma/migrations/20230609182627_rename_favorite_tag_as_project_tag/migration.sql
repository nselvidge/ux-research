/*
  Warnings:

  - You are about to drop the `FavoriteTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FavoriteTag" DROP CONSTRAINT "FavoriteTag_projectId_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteTag" DROP CONSTRAINT "FavoriteTag_tagId_fkey";

-- DropTable
DROP TABLE "FavoriteTag";

-- CreateTable
CREATE TABLE "ProjectTags" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "ProjectTags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectTags_projectId_tagId_key" ON "ProjectTags"("projectId", "tagId");

-- AddForeignKey
ALTER TABLE "ProjectTags" ADD CONSTRAINT "ProjectTags_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTags" ADD CONSTRAINT "ProjectTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
