import { NotifierInteractor } from "@root/domains/notifications/interactors/Notifier";
import { Logger } from "@root/global/logger";
import { Settings } from "@root/global/Settings";
import path from "path";
import { inject, injectable } from "tsyringe";
import { InterviewNotificationService as BaseInterviewNotificationService } from "../interactors/InteractorServices";

@injectable()
export class InterviewNotificationService
  implements BaseInterviewNotificationService
{
  constructor(
    @inject("Logger") private logger: Logger,
    private notifier: NotifierInteractor,
    private settings: Settings
  ) {}
  async sendInterviewReadyNotification({
    interviewId,
    interviewName,
    userId,
    highlightCount,
    previewImageUrl,
    fullName,
  }: {
    interviewId: string;
    interviewName: string;
    userId: string;
    fullName: string;
    highlightCount: number;
    previewImageUrl: string | null;
  }): Promise<void> {
    this.logger.info(
      `Sending interview ready notification for interview ${interviewId} to user ${userId}`
    );

    const template = path.join(
      __dirname,
      "../templates",
      "interview-ready.hbs"
    );

    return this.notifier.sendNotification(userId, {
      template,
      title: "Your interview is ready",
      templateData: {
        interviewName: interviewName,
        highlightCount: highlightCount,
        fullName,
        previewImageUrl,
        url: `${this.settings.getSetting(
          "protocol"
        )}://${this.settings.getSetting(
          "serverHost"
        )}/interview/${interviewId}`,
      },
    });
  }
}
