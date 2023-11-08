-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('admin', 'member');

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceRole" (
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "type" "RoleType" NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceRole_userId_workspaceId_key" ON "WorkspaceRole"("userId", "workspaceId");

-- AddForeignKey
ALTER TABLE "WorkspaceRole" ADD CONSTRAINT "WorkspaceRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceRole" ADD CONSTRAINT "WorkspaceRole_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- Add existing users to a premade workspace

INSERT INTO "Workspace" (id, name) VALUES ('05bfceae-61c5-4c9a-aba9-c1189d89db2c','Test');
INSERT INTO "WorkspaceRole" ("userId", "workspaceId", "type") 
SELECT 
  id AS userId, 
  '05bfceae-61c5-4c9a-aba9-c1189d89db2c' AS workspaceId, 
  'admin' AS type 
FROM "User";