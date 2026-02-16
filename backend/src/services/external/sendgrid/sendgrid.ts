import sgMail from "@sendgrid/mail";
import { NotificationError } from "../../../errors/index.js";

if (!process.env.SENDGRID_API_KEY) {
    throw new Error("SENDGRID_API_KEY is missing from the environment.");
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

//sgMail.setDataResidency("eu");

const FROM_EMAIL = process.env.EMAIL_FROM as string;
const FROM_NAME = process.env.EMAIL_FROM_NAME as string;

export interface EmailOptions {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    cc?: string | string[];
    bcc?: string | string[];
    replyTo?: string;
    attachments?: Array<{
        content: string;
        filename: string;
        type?: string;
        disposition?: "attachment" | "inline";
    }>;
}
export type TypeSendMail = (options: EmailOptions) => Promise<void>;

export async function sendEmail(options: EmailOptions): Promise<void> {
    if (!options.text && !options.html) {
        throw new Error("Email must have 'text' or 'html' content");
    }

    const mail: sgMail.MailDataRequired = {
        from: { email: FROM_EMAIL, name: FROM_NAME },
        to: options.to,
        subject: options.subject,
        text: options.text ?? "default email text content.",
        html: options.html,
        //cc: options.cc,
        //bcc: options.bcc,
        //replyTo: options.replyTo ? {email: options.replyTo} : undefined,
        //attachments: options.attachments
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
