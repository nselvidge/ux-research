import { randomUUID } from "node:crypto";

export interface WorkspaceInvite {
  token: string;
  workspaceId: string;
  inviterId: string;
  isExpired: boolean;
  inviteeEmail: string | null;
  isAccepted: boolean;
}

export const createWorkspaceInvite = ({
  workspaceId,
  inviterId,
  inviteeEmail,
}: {
  workspaceId: string;
  inviterId: string;
  inviteeEmail: string | null;
}): WorkspaceInvite => ({
  token: randomUUID(),
  workspaceId,
  inviterId,
  isExpired: false,
  inviteeEmail,
  isAccepted: false,
});
