import sgMail from "@sendgrid/mail";
import { NotificationError } from "../../common/errors/index.js";
import { EmailOptions, IEmailService } from "./email.js";

//sgMail.setDataResidency("eu");

export class SendGridEmailService implements IEmailService {
    private FROM_EMAIL: string;
    private FROM_NAME: string;

    constructor() {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
        this.FROM_EMAIL = process.env.EMAIL_FROM as string;
        this.FROM_NAME = process.env.EMAIL_FROM_NAME as string;
    }

    async sendEmail(options: EmailOptions): Promise<void> {
        if (!options.text && !options.html) {
            throw new Error("Email must have 'text' or 'html' content");
        }

        const mail: sgMail.MailDataRequired = {
            from: { email: this.FROM_EMAIL, name: this.FROM_NAME },
            to: options.to,
            subject: options.subject,
            text: options.text ?? "default email text content.",
            html: options.html,
        };

        try {
            const [response] = await sgMail.send(mail);
            console.log(
                "Email sent successfully.",
                JSON.stringify({
                    messageId: response.headers["x-message-id"],
                    to: Array.isArray(options.to)
                        ? options.to.join(", ")
                        : options.to,
                    subject: options.subject,
                })
            );
        } catch (err: any) {
            console.log(
                "Failed to send email via SendGrid.",
                JSON.stringify({
                    error: err.message,
                    response: err.response?.body,
                    to: Array.isArray(options.to)
                        ? options.to.join(", ")
                        : options.to,
                    subject: options.subject,
                })
            );

            throw new NotificationError("Notification service failed");
        }
    }
}
