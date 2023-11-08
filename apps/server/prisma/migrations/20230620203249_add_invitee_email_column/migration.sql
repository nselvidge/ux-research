-- AlterTable
ALTER TABLE "WorkspaceInvite" ADD COLUMN     "inviteeEmail" TEXT,
ADD COLUMN     "isAccepted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "isExpired" SET DEFAULT false;
