import { Config } from "../../config/index.js";
import logger from "../../common/utils/logger.js";
import { TypeSendMail } from "./email.js";
import {
    genAccVerificationEmailBody,
    genPWResetEmailBody,
} from "./templates.js";
import { NotificationError } from "../../common/errors/index.js";

type TAccountVerificationEmail = {
    email: string;
    name: string;
    accountVerificationSecret: string;
};
type TPWResetEmail = {
    email: string;
    name: string;
    passwordResetSecret: string;
};

export interface INotificationService {
    sendAccountVerificationEmail(
        emailData: TAccountVerificationEmail
    ): Promise<void>;
    sendPWResetEmail(emailData: TPWResetEmail): Promise<void>;
}

export class NotificationService implements INotificationService {
    constructor(
        private sendEmail: TypeSendMail,
        private config: Config
    ) {}

    async sendAccountVerificationEmail(
        user: TAccountVerificationEmail
    ): Promise<void> {
        const emailBody = {
            to: user.email,
            subject:
                "Welcome to the self-service-kiosk-and-restaurant-management-system",
            html: genAccVerificationEmailBody(
                user.name,
                user.accountVerificationSecret,
                this.config.FRONTEND_URL
            ),
        };

        try {
            this.config.IS_NOTIF_ON === false
                ? logger.info(emailBody)
                : await this.sendEmail(emailBody);
        } catch (err) {
            logger.error(err, "Account verification email failed.");

            if (err instanceof NotificationError) {
                throw err;
            }

            throw new NotificationError();
        }
    }

    async sendPWResetEmail(user: TPWResetEmail): Promise<void> {
        const emailBody = {
            to: user.email,
            subject:
                "Reset password on self-service-kiosk-and-restaurant-management-system",
            html: genPWResetEmailBody(
                user.name,
                user.passwordResetSecret,
                this.config.FRONTEND_URL
            ),
        };

        try {
            this.config.IS_NOTIF_ON === false
                ? logger.info(emailBody)
                : await this.sendEmail(emailBody);
        } catch (err) {
            logger.error(err, "Password reset email failed.");

            if (err instanceof NotificationError) {
                throw err;
            }

            throw new NotificationError();
        }
    }
}
