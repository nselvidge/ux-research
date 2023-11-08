import { Resolvers } from "@root/global/generated/graphql";
import { injectable } from "tsyringe";
import { ReceiverInteractor } from "../interactors/Receiver";
import { PersistenceNotificationPreference } from "../interactors/serializers/SerializedNotificationPreferences";

@injectable()
export class NotificationPreferencesResolver {
  constructor(private receiver: ReceiverInteractor) {}
  resolvers: Resolvers = {
    User: {
      notificationPreferences: async (user, _) => {
        return this.receiver.getNotificationPreferencesForUser(user.id);
      },
    },
    NotificationPreferences: {
      id: (notificationPreferences: PersistenceNotificationPreference) =>
        notificationPreferences.userId,
    },
    Mutation: {
      updateEmailPreference: async (_, { notificationEmails }, { userId }) => {
        return this.receiver.updateEmailPreference(userId, notificationEmails);
      },
    },
  };
}
