import { prisma } from "./scriptUtils";

// Script to merge all content from workspace A into workspace B

// Prod
const workspaceA = "601c1bc9-bcdb-42a4-9f3f-c7ccb4f98944";
const workspaceB = "57e064de-1405-40c9-bfa5-89d83034968a";

// Dev
// const workspaceA = "e47c2c80-ab19-4209-8aa3-398bfa88a73d";
// const workspaceB = "bee8e2a8-16c3-4c42-959c-cef0b6c4d9ec";

const updateWorkspaceRoles = () =>
  prisma.workspaceRole.updateMany({
    where: {
      workspace: {
        id: workspaceA,
      },
    },
    data: {
      workspaceId: workspaceB,
    },
  });

const updateWorkspaceTags = () =>
  prisma.tag.updateMany({
    where: {
      workspaceId: workspaceA,
    },
    data: {
      workspaceId: workspaceB,
    },
  });

const updateInterviews = () =>
  prisma.interview.updateMany({
    where: {
      workspaceId: workspaceA,
    },
    data: {
      workspaceId: workspaceB,
    },
  });

const updateWorkspaceInvites = () =>
  prisma.workspaceInvite.updateMany({
    where: {
      workspaceId: workspaceA,
    },
    data: {
      workspaceId: workspaceB,
    },
  });

const runAllUpdates = async () => {
  await prisma.$transaction([
    updateWorkspaceRoles(),
    updateWorkspaceTags(),
    updateInterviews(),
    updateWorkspaceInvites(),
  ]);
};

runAllUpdates();
