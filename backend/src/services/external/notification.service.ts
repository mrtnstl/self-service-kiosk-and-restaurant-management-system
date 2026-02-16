import { Config } from "../../config/index.js";
import logger from "../../utils/logger.js";
import { TypeSendMail } from "./sendgrid/sendgrid.js";
import {
    genAccVerificationEmailBody,
    genPWResetEmailBody,
} from "./templates.js";

class NotificationService {
    private static instance: NotificationService;
    sendEmail!: TypeSendMail;
    config!: Config;
    constructor(sendEmail: TypeSendMail, config: Config) {
        if (NotificationService.instance) {
            return NotificationService.instance;
        }
        this.sendEmail = sendEmail;
        this.config = config;
        NotificationService.instance = this;
    }
    async sendAccountVerificationEmail(user: {
        email: string;
        name: string;
        accountVerificationSecret: string;
    }): Promise<void> {
        try {
            this.config.NODE_ENV !== "production"
                ? logger.info({
                      to: user.email,
                      subject:
                          "Welcome to the self-service-kiosk-and-restaurant-management-system",
                      html: genAccVerificationEmailBody(
                          user.name,
                          user.accountVerificationSecret,
                          this.config.FRONTEND_URL
                      ),
                  })
                : await this.sendEmail({
                      to: user.email,
                      subject:
                          "Welcome to the self-service-kiosk-and-restaurant-management-system",
                      html: genAccVerificationEmailBody(
                          user.name,
                          user.accountVerificationSecret,
                          this.config.FRONTEND_URL
                      ),
                  });
        } catch (err) {
            logger.error(err, "Account verification email failed.");
        }
    }
    async sendPWResetEmail(user: {
        email: string;
        name: string;
        passwordResetSecret: string;
    }): Promise<void> {
        try {
            this.config.NODE_ENV !== "production"
                ? logger.info({
                      to: user.email,
                      subject:
                          "Reset password on self-service-kiosk-and-restaurant-management-system",
                      html: genPWResetEmailBody(
                          user.name,
                          user.passwordResetSecret,
                          this.config.FRONTEND_URL
                      ),
                  })
                : await this.sendEmail({
                      to: user.email,
                      subject:
                          "Reset password on self-service-kiosk-and-restaurant-management-system",
                      html: genPWResetEmailBody(
                          user.name,
                          user.passwordResetSecret,
                          this.config.FRONTEND_URL
                      ),
                  });
        } catch (err) {
            logger.error(err, "Password reset email failed.");
        }
    }
}

export default NotificationService;
