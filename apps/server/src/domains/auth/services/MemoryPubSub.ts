import { AdminPublisher } from "../interactors/Admin";

export class MemoryPubSub implements AdminPublisher {
  newWorkspaceCallbacks: ((workspaceId: string) => void)[] = [];
  workspaceChangedCallbacks: ((userId: string) => void)[] = [];
  publishNewWorkspace: (workspaceId: string) => Promise<void> = async (
    workspaceId: string
  ) => {
    this.newWorkspaceCallbacks.forEach((callback) => callback(workspaceId));

    return;
  };

  subscribeToNewWorkspace: (callback: (workspaceId: string) => void) => void = (
    callback: (workspaceId: string) => void
  ) => {
    this.newWorkspaceCallbacks.push(callback);
  };

  unsubscribeFromNewWorkspace: (
    callback: (workspaceId: string) => void
  ) => void = (callback: (workspaceId: string) => void) => {
    this.newWorkspaceCallbacks = this.newWorkspaceCallbacks.filter(
      (cb) => cb !== callback
    );
  };

  subscribeToWorkspaceChanged: (callback: (userId: string) => void) => void = (
    callback: (userId: string) => void
  ) => {
    this.workspaceChangedCallbacks.push(callback);
  };

  unsubscribeFromWorkspaceChanged: (
    callback: (userId: string) => void
  ) => void = (callback: (userId: string) => void) => {
    this.workspaceChangedCallbacks = this.workspaceChangedCallbacks.filter(
      (cb) => cb !== callback
    );
  };

  publishUserWorkspaceChanged: (userId: string) => Promise<void> = async (
    userId: string
  ) => {
    this.workspaceChangedCallbacks.forEach((callback) => callback(userId));

    return;
  };
}
