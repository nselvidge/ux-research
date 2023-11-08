/* UploaderInteractor
 * Responsible for handling the upload of a video to create a new interview
 */
import { CreatorInteractor } from "@root/domains/video/interactors/CreatorInteractor";
import { Logger } from "@root/global/logger";
import { randomUUID } from "crypto";
import { inject, injectable } from "tsyringe";
import { createNewPendingRecordingInterview } from "../entities/Interview";
import { InteractorRepositories } from "./InteractorRepositories";
import { InterviewerInteractor } from "./InterviewerInteractor";
import {
  deserializeInterview,
  serializeInterview,
} from "./serializers/SerializedInterview";

@injectable()
export class UploaderInteractor {
  constructor(
    @inject("Repositories") private repositories: InteractorRepositories,
    private creator: CreatorInteractor,
    private interviewer: InterviewerInteractor,
    @inject("Logger") private logger: Logger
  ) {}

  handleUploadComplete = async ({
    passthroughId: interviewId,
    videoId,
  }: {
    passthroughId: string;
    videoId: string;
  }) => {
    const serializedInterview =
      await this.repositories.interviews.maybeGetInterviewById(interviewId);

    if (!serializedInterview) {
      this.logger.info("No interview found for passthroughId", { interviewId });
      return;
    }

    const interview = deserializeInterview(serializedInterview);

    return this.interviewer.addRecordingToInterview(
      interviewId,
      interview.date,
      videoId
    );
  };

  createNewUploadInterview = async ({
    workspaceId,
    creatorId,
    interviewName,
    interviewDate,
  }: {
    workspaceId: string;
    creatorId: string;
    interviewName: string;
    interviewDate: Date;
  }) => {
    const interviewId = randomUUID();

    const { url: uploadUrl, id: uploadId } = await this.creator.createUploadUrl(
      interviewId
    );

    const interviewSource = {
      platform: "upload" as const,
      sourceId: uploadId,
    };

    const interview = createNewPendingRecordingInterview({
      id: interviewId,
      workspaceId,
      creatorId,
      name: interviewName,
      date: interviewDate,
      source: interviewSource,
    });

    await this.repositories.interviews.createInterview(
      serializeInterview(interview)
    );

    return { interviewId: interview.id, uploadUrl };
  };
}
