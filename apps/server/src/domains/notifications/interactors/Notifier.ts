import { MemberInteractor } from "@root/domains/auth/interactors/Member";
import { Logger } from "@root/global/logger";
import { inject, injectable } from "tsyringe";
import { PersistenceNotificationPreference } from "./serializers/SerializedNotificationPreferences";

export interface Notification<T> {
  title: string;
  template: string;
  templateData: T;
}

export type NotificationPlatform = "email";

export interface NotificationService {
  sendNotification<T>(
    userIdentity: { email: string },
    notification: Notification<T>
  ): Promise<void>;
}

export interface NotificationServiceFactory {
  createNotificationService(platform: string): NotificationService;
}

export interface NotificationPreferencesRepository {
  getNotificationPreferencesByUserId(
    userId: string
  ): Promise<PersistenceNotificationPreference | null>;
}

export interface Repositories {
  notificationPreferences: NotificationPreferencesRepository;
}

@injectable()
export class NotifierInteractor {
  constructor(
    @inject("NotificationServiceFactory")
    private notificationServiceFactory: NotificationServiceFactory,
    private member: MemberInteractor,
    @inject("Logger") private logger: Logger,
    @inject("Repositories") private repositories: Repositories
  ) {}
  forceSendEmail = async <T>(userId: string, notification: Notification<T>) => {
    const user = await this.member.getMemberById(userId);

    const notificationService =
      this.notificationServiceFactory.createNotificationService("email");

    return notificationService.sendNotification(
      { email: user.email },
      notification
    );
  };
  sendInvitation = async <T>(email: string, notification: Notification<T>) => {
    const notificationService =
      this.notificationServiceFactory.createNotificationService("email");

    return notificationService.sendNotification({ email }, notification);
  };

  sendNotification = async <T>(
    userId: string,
    notification: Notification<T>
  ) => {
    const user = await this.member.getMemberById(userId);
    const notificationPreferences =
      await this.repositories.notificationPreferences.getNotificationPreferencesByUserId(
        userId
      );

    if (!user.confirmed) {
      this.logger.info(
        `User ${userId} is not confirmed, not sending notification`
      );
      return;
    }

    if (
      notificationPreferences &&
      !notificationPreferences.notificationEmails
    ) {
      this.logger.info(
        `User ${userId} has disabled email notifications, not sending notification`
      );
      return;
    }

    //TODO: Add support for other platforms

    const notificationService =
      this.notificationServiceFactory.createNotificationService("email");

    return notificationService.sendNotification(
      { email: user.email },
      notification
    );
  };
}
