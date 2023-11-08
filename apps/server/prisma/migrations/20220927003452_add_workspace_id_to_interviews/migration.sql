/*
  Warnings:

  - Added the required column `workspaceId` to the `Interview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Interview" ADD COLUMN  "workspaceId" TEXT;

UPDATE "Interview" SET "workspaceId" = '05bfceae-61c5-4c9a-aba9-c1189d89db2c';

ALTER TABLE "Interview" ALTER COLUMN "workspaceId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
