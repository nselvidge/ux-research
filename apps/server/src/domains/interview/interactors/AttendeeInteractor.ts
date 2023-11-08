import { RecorderInteractor } from "@root/domains/video/interactors/RecorderInteractor";
import { Logger } from "@root/global/logger";
import { inject, injectable } from "tsyringe";
import { InteractorRepositories } from "./InteractorRepositories";
import { InterviewerInteractor } from "./InterviewerInteractor";

class UnableToCreateBotError extends Error {
  public code = "UnableToCreateBot";
  public message = "Unable to create bot, please try again in a few seconds";
}

@injectable()
export class AttendeeInteractor {
  constructor(
    @inject("Repositories") private repositories: InteractorRepositories,
    @inject("Logger") private logger: Logger,
    private recorder: RecorderInteractor,
    private interviewer: InterviewerInteractor
  ) {}

  attendInterview = async ({
    meetingId,
    meetingPlatform,
    userId,
    workspaceId,
    projectId,
  }: {
    meetingId: string;
    userId: string;
    meetingPlatform: "zoom";
    workspaceId: string;
    projectId: string | null;
  }) => {
    this.logger.info("Joining interview", {
      meetingId,
      userId,
      workspaceId,
      meetingPlatform,
    });

    // add bot to meeting
    const { recorder, title, startTime } = await this.recorder.recordMeeting({
      idToRecord: meetingId,
      recordablePlatform: meetingPlatform,
      userId,
      workspaceId,
    });

    if (!recorder.externalId || !title || !startTime) {
      this.logger.error(
        "Cannot create pending interview, no recorder details",
        {
          recorder,
          title,
          startTime,
        }
      );

      throw new UnableToCreateBotError();
    }

    // create pending interview
    const pendingInterview = await this.interviewer.createPendingInterview({
      workspaceId,
      creatorId: userId,
      sourceId: recorder.externalId,
      sourceLabel: recorder.type,
      projectId,
      name: title || undefined,
      date: startTime || undefined,
    });

    // return pending interview
    return pendingInterview;
  };
}
