import { PrismaClient } from "@root/global/generated/prisma";
import { inject, injectable } from "tsyringe";
import { NotificationRepository } from "../interactors/Receiver";
import { NotificationPreferencesRepository as NotifierRepository } from "../interactors/Notifier";
import { PersistenceNotificationPreference } from "../interactors/serializers/SerializedNotificationPreferences";

@injectable()
export class NotificationPreferencesRepository
  implements NotificationRepository, NotifierRepository
{
  constructor(@inject("PrismaClient") private prisma: PrismaClient) {}

  getNotificationPreferencesByUserId = async (userId: string) => {
    return this.prisma.notificationPreferences.findUnique({
      where: { userId },
    });
  };

  createNotificationPreferences = async (
    userId: string,
    notificationEmails: boolean
  ) => {
    return this.prisma.notificationPreferences.create({
      data: {
        userId,
        notificationEmails,
      },
    });
  };

  updateEmailPreference = async (
    notificationPreferences: PersistenceNotificationPreference
  ) => {
    return this.prisma.notificationPreferences.update({
      where: { userId: notificationPreferences.userId },
      data: {
        notificationEmails: notificationPreferences.notificationEmails,
      },
    });
  };
}
