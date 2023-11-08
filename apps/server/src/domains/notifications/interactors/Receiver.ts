import { inject, injectable } from "tsyringe";
import {
  deserializeNotificationPreferences,
  PersistenceNotificationPreference,
  serializePersistenceNotificationPreferences,
} from "./serializers/SerializedNotificationPreferences";

export interface NotificationRepository {
  getNotificationPreferencesByUserId: (
    userId: string
  ) => Promise<PersistenceNotificationPreference | null>;
  createNotificationPreferences: (
    userId: string,
    notificationEmails: boolean
  ) => Promise<PersistenceNotificationPreference>;
  updateEmailPreference: (
    notificationPreferences: PersistenceNotificationPreference
  ) => Promise<PersistenceNotificationPreference>;
}

export interface NotificationRepositories {
  notificationPreferences: NotificationRepository;
}

@injectable()
export class ReceiverInteractor {
  constructor(
    @inject("Repositories") private repositories: NotificationRepositories
  ) {}
  getNotificationPreferencesForUser = async (userId: string) => {
    const notificationPreferences =
      await this.repositories.notificationPreferences.getNotificationPreferencesByUserId(
        userId
      );

    return notificationPreferences;
  };
  updateEmailPreference = async (
    userId: string,
    notificationEmails: boolean
  ) => {
    const notificationPreferences =
      await this.repositories.notificationPreferences.getNotificationPreferencesByUserId(
        userId
      );
    if (!notificationPreferences) {
      return this.repositories.notificationPreferences.createNotificationPreferences(
        userId,
        notificationEmails
      );
    }

    const entity = deserializeNotificationPreferences(
      notificationPreferences
    ).changeEmailPreference(notificationEmails);

    await this.repositories.notificationPreferences.updateEmailPreference(
      serializePersistenceNotificationPreferences(entity)
    );

    return serializePersistenceNotificationPreferences(entity);
  };
}
