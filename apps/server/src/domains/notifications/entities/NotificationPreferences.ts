export class NotificationPreferences {
  private constructor(
    public readonly userId: string,
    public readonly notificationEmails: boolean
  ) {}

  static create = ({
    userId,
    notificationEmails,
  }: {
    userId: string;
    notificationEmails: boolean;
  }) => {
    return new NotificationPreferences(userId, notificationEmails);
  };

  changeEmailPreference = (notificationEmails: boolean) => {
    return NotificationPreferences.create({
      ...this,
      notificationEmails,
    });
  };
}
