import { Logger } from "@root/global/logger";
import { inject, injectable } from "tsyringe";
import { Notification, NotificationService } from "../interactors/Notifier";
import handlebars from "handlebars";
import fs from "fs/promises";
import sgMail from "@sendgrid/mail";
import { Settings } from "@root/global/Settings";

@injectable()
export class EmailNotificationService implements NotificationService {
  constructor(
    @inject("Logger") private logger: Logger,
    private settings: Settings
  ) {}
  sendNotification = async <T>(
    userIdentity: { email: string },
    notification: Notification<T>
  ) => {
    this.logger.info(
      `Sending email notification to ${userIdentity.email} with title ${notification.title}`
    );

    const templateString = await fs.readFile(notification.template, "utf-8");

    if (!templateString) {
      throw new Error(`No template found at ${notification.template}`);
    }

    const template = handlebars.compile(templateString);

    sgMail.setApiKey(this.settings.getSetting("sendgridApiKey"));

    const msg = {
      to: userIdentity.email,
      from: "Resonate<no-reply@resonateapp.com>",
      subject: notification.title,
      html: template(notification.templateData),
    };

    await sgMail.send(msg);
    this.logger.info("Email sent successfully");

    return;
  };
}
