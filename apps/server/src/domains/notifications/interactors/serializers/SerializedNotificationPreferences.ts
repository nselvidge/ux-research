import { NotificationPreferences } from "../../entities/NotificationPreferences";

export interface PersistenceNotificationPreference {
  userId: string;
  notificationEmails: boolean;
}

export const serializePersistenceNotificationPreferences = (
  notificationPreferences: NotificationPreferences
): PersistenceNotificationPreference => {
  return {
    userId: notificationPreferences.userId,
    notificationEmails: notificationPreferences.notificationEmails,
  };
};

export const deserializeNotificationPreferences = (
  serializedNotificationPreferences: PersistenceNotificationPreference
): NotificationPreferences => {
  return NotificationPreferences.create(serializedNotificationPreferences);
};
