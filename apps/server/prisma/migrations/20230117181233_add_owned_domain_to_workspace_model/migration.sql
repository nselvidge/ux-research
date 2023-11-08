/*
  Warnings:

  - A unique constraint covering the columns `[ownedDomain]` on the table `Workspace` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "ownedDomain" TEXT,
ALTER COLUMN "publicInterviewLinks" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_ownedDomain_key" ON "Workspace"("ownedDomain");
