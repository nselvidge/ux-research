import { injectable } from "tsyringe";
import { EmailNotificationService } from "./EmailNotificationService";

@injectable()
export class NotificationServiceFactory {
  constructor(private email: EmailNotificationService) {}
  createNotificationService(platform: "email") {
    return this.email;
  }
}
