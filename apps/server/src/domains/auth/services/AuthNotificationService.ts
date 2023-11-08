import { NotifierInteractor } from "@root/domains/notifications/interactors/Notifier";
import { Logger } from "@root/global/logger";
import { Repositories } from "@root/global/Repositories";
import { Settings } from "@root/global/Settings";
import path from "path";
import { isNil, isNot } from "remeda";
import { inject, injectable } from "tsyringe";
import { AuthNotificationService as AdminNotificationService } from "../interactors/Admin";

@injectable()
export class AuthNotificationService implements AdminNotificationService {
  constructor(
    private notifier: NotifierInteractor,
    private repositories: Repositories,
    @inject("Logger") private logger: Logger,
    private settings: Settings
  ) {}
  async notifyAdminsOfNewSignup({
    email,
    fullName,
    workspaceName,
  }: {
    email: string;
    fullName: string;
    workspaceName: string;
  }) {
    const newSignupEmailPath = path.join(
      __dirname,
      "../templates/new-signup.hbs"
    );

    //TODO handle this in a better way
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

    if (adminEmails.length === 0) {
      this.logger.info("No admin emails found");
      return;
    }

    const adminIds = await Promise.all(
      adminEmails.map((email) =>
        this.repositories.users.getUserByEmail(email).then((user) => user?.id)
      )
    );

    this.logger.info(
      `Sending new signup email to admins: ${adminEmails.join(",")}`
    );

    await Promise.all(
      adminIds.filter(isNot(isNil)).map((adminId) =>
        this.notifier.forceSendEmail(adminId, {
          title: "New signup on Resonate",
          template: newSignupEmailPath,
          templateData: {
            email,
            fullName,
            workspaceName,
          },
        })
      )
    );
  }

  async sendWelcomeEmail({
    userId,
    fullName,
    workspaceName,
  }: {
    userId: string;
    fullName: string;
    workspaceName: string;
  }) {
    const welcomeEmailPath = path.join(__dirname, "../templates/welcome.hbs");

    return this.notifier.sendNotification(userId, {
      title: "Welcome to Resonate",
      template: welcomeEmailPath,
      templateData: {
        fullName,
        workspaceName,
      },
    });
  }

  async sendConfirmationEmail({
    userId,
    fullName,
    workspaceName,
  }: {
    userId: string;
    fullName: string;
    workspaceName: string;
  }) {
    const welcomeEmailPath = path.join(__dirname, "../templates/welcome.hbs");

    return this.notifier.forceSendEmail(userId, {
      title: "Welcome to Resonate",
      template: welcomeEmailPath,
      templateData: {
        fullName,
        workspaceName,
      },
    });
  }

  async sendInviteEmail({
    email,
    inviterName,
    workspaceName,
    token,
    interviewCount,
    highlightCount,
  }: {
    email: string;
    inviterName: string;
    workspaceName: string;
    token: string;
    interviewCount: number;
    highlightCount: number;
  }) {
    const inviteEmailPath = path.join(__dirname, "../templates/invite.hbs");
    const baseUrl = this.settings.getSetting("redirectUrl");

    return this.notifier.sendInvitation(email, {
      title: `🤝 ${inviterName} invited you to join ${workspaceName}`,
      template: inviteEmailPath,
      templateData: {
        inviter: inviterName,
        workspace: workspaceName,
        interviewCount,
        highlightCount,
        inviteUrl: `${baseUrl}/invite/${token}`,
      },
    });
  }
}
