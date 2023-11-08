/* Report Interactor
 * Responsible for managing the interview summary report
 */
import { AdminInteractor } from "@root/domains/auth/interactors/Admin";
import { inject, injectable } from "tsyringe";
import { isInterview, updateSummaryOnInterview } from "../entities/Interview";
import { InteractorRepositories } from "./InteractorRepositories";
import {
  deserializeInterview,
  serializeInterview,
} from "./serializers/SerializedInterview";

@injectable()
export class ReportInteractor {
  constructor(
    private admin: AdminInteractor,
    @inject("Repositories") private repositories: InteractorRepositories
  ) {}
  ensureUserIsReporter = async (
    userId: string,
    interviewId: string
  ): Promise<void> => {
    const interview =
      await this.repositories.interviews.getInterviewWithoutTranscript(
        interviewId
      );

    if (!(await this.admin.canEditWorkspace(userId, interview.workspaceId))) {
      throw new Error("workspace not found");
    }
    return;
  };
  updateSummary = async ({
    interviewId,
    text,
  }: {
    interviewId: string;
    text: string;
  }) => {
    const interview = await this.repositories.interviews
      .getInterviewById(interviewId)
      .then(deserializeInterview);

    if (!isInterview(interview)) {
      throw new Error("Interview is not ready, cannot update summary");
    }

    const event = updateSummaryOnInterview(interview, text);

    if ("updateSummary" in event) {
      await this.repositories.interviews.updateSummary(
        event.interview.id,
        event.updateSummary
      );
    } else if ("createSummary" in event) {
      await this.repositories.interviews.addSummary(
        event.interview.id,
        event.createSummary
      );
    }

    return serializeInterview(event.interview);
  };
}
