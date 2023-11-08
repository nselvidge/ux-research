-- CreateTable
CREATE TABLE "WorkspaceInvite" (
    "token" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "inviterId" TEXT NOT NULL,
    "isExpired" BOOLEAN NOT NULL,

    CONSTRAINT "WorkspaceInvite_pkey" PRIMARY KEY ("token")
);

-- AddForeignKey
ALTER TABLE "WorkspaceInvite" ADD CONSTRAINT "WorkspaceInvite_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
