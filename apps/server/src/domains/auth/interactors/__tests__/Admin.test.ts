import { hash, verify } from "argon2";
import { container } from "tsyringe";
import { AuthNotificationService } from "../../services/AuthNotificationService";
import { AdminInteractor } from "../Admin";

jest.mock("../../services/AuthNotificationService");

const users = {
  createUser: jest.fn(),
  getUserById: jest.fn(),
};

const getWorkspaceByOwnedDomain = jest.fn();
const addMemberToWorkspace = jest.fn();
const createWorkspace = jest.fn();

const workspaces = {
  createWorkspace,
  getWorkspaceByOwnedDomain,
  addMemberToWorkspace,
};

const workspaceStatsMock = {
  getWorkspaceStats: jest.fn(),
};

const pubsub = {
  publishNewWorkspace: jest.fn(),
};

const mockNotifications = new (AuthNotificationService as any)();

container.register("Repositories", { useValue: { users, workspaces } });
container.register("AuthNotificationService", { useValue: mockNotifications });
container.register("WorkspacePubSub", { useValue: pubsub });
container.register("WorkspaceStatsService", { useValue: workspaceStatsMock });

describe("AdminInteractor", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("signup", () => {
    it("should persist a hashed version of the password", async () => {
      const password = "A puppy playing with a squeaky toy";
      const identity = {
        token: await hash(password),
        type: "password" as const,
      };
      const testUser = {
        email: "test@example.com",
        fullName: "Nate",
        identities: [],
      };
      users.getUserById.mockResolvedValueOnce(testUser);
      const admin = container.resolve(AdminInteractor);

      await admin.signup({
        email: "test@example.com",
        token: identity.token,
        type: identity.type,
        fullName: testUser.fullName,
      });

      const persistenceUser = users.createUser.mock.calls[0][0];

      expect(persistenceUser.identities[0].token).not.toBe(password);
      expect(await verify(persistenceUser.identities[0].token, password)).toBe(
        true
      );
    });
    it("should add the new member to existing workspace if it owns the user's domain", async () => {
      const password = "A puppy playing with a squeaky toy";
      const identity = {
        token: await hash(password),
        type: "password" as const,
      };
      const testUser = {
        email: "test@example.com",
        fullName: "Nate",
        identities: [],
      };
      users.getUserById.mockResolvedValueOnce(testUser);
      getWorkspaceByOwnedDomain.mockResolvedValueOnce({
        id: "123",
        name: "Test Workspace",
        ownedDomain: "example.com",
        roles: [],
        invites: [],
        projects: [],
      });

      const admin = container.resolve(AdminInteractor);

      await admin.signup({
        email: "test@example.com",
        token: identity.token,
        type: identity.type,
        fullName: testUser.fullName,
      });

      const workspaceUpdate = addMemberToWorkspace.mock.calls[0][0];

      expect(workspaceUpdate.workspaceId).toBe("123");
    });

    it("Should name a workspace after the user's email domain if it isn't a shared domain", async () => {
      const password = "A puppy playing with a squeaky toy";
      const identity = {
        token: await hash(password),
        type: "password" as const,
      };
      const testUser = {
        email: "test@example.com",
        fullName: "Nate",
        identities: [],
      };
      users.getUserById.mockResolvedValueOnce(testUser);
      getWorkspaceByOwnedDomain.mockResolvedValueOnce(null);

      const admin = container.resolve(AdminInteractor);

      await admin.signup({
        email: "test@example.com",
        token: identity.token,
        type: identity.type,
        fullName: testUser.fullName,
      });

      const workspaceUpdate = createWorkspace.mock.calls[0][0];

      expect(workspaceUpdate.name).toBe("Example Workspace");
    });
    it("Should name a workspace after the user's name if their email uses a shared domain", async () => {
      const password = "A puppy playing with a squeaky toy";
      const identity = {
        token: await hash(password),
        type: "password" as const,
      };
      const testUser = {
        email: "test@gmail.com",
        fullName: "Nate",
        identities: [],
      };
      users.getUserById.mockResolvedValueOnce(testUser);
      getWorkspaceByOwnedDomain.mockResolvedValueOnce(null);

      const admin = container.resolve(AdminInteractor);

      await admin.signup({
        email: "test@gmail.com",
        token: identity.token,
        type: identity.type,
        fullName: testUser.fullName,
      });

      const workspaceUpdate = createWorkspace.mock.calls[0][0];

      expect(workspaceUpdate.name).toBe("Nate's Workspace");
    });
  });
});
