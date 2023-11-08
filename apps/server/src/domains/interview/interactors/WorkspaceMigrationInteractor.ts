import { MemberInteractor } from "@root/domains/auth/interactors/Member";
import { Logger } from "@root/global/logger";
import { inject, injectable } from "tsyringe";
import { InteractorRepositories } from "./InteractorRepositories";

@injectable()
export class WorkspaceMigrationInteractor {
  constructor(
    @inject("Logger") private logger: Logger,
    private memberInteractor: MemberInteractor,
    private repositories: InteractorRepositories
  ) {}

  // handleUserWorkspaceChanged = async (userId: string) => {
  //   const user = await this.memberInteractor.getMemberById(userId);
  //   const workspaces = await this.memberInteractor.getUserWorkspaces(user.id);

  //   if (workspaces.length !== 1) {
  //     // do not migrate content for users with multiple workspaces
  //     return null;
  //   }

  //   const workspace = workspaces[0];
  //   const interviews =
  //     await this.repositories.interviews.getInterviewsCreatedByUser(
  //       workspace.id
  //     );

  //   if (interviews.length === 0) {
  //     return null;
  //   }

  //   await Promise.all(
  //     interviews.map((interview) => {
  //       this.logger.info("Migrating interview", {
  //         interviewId: interview.id,
  //         userId,
  //       });
  //       const oldWorkspace = await this.memberInteractor.getWorkspace(
  //         interview.workspaceId
  //       );

  //       if (oldWorkspace.id === workspace.id) {
  //         return null;
  //       }

  //       if (oldWorkspace.roles.length === 0) {
  //         this.logger.info("Migrating all content in old workspace", {
  //           interviewId: interview.id,
  //           userId,
  //         });
  //         // migrate tags and projects as well
  //       } else {
  //         return Promise.all([
  //           this.repositories.interviews.updateInterviewProject(
  //             interview.id,
  //             null
  //           ),
  //           this.repositories.interviews.removeTagsFromAllHighlights(
  //             interview.id
  //           ),
  //           this.repositories.interviews.updateWorkspace(workspace.id),
  //         ]);
  //       }
  //     })
  //   );
  // };
}
