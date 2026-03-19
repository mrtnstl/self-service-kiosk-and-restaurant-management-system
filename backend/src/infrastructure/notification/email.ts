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

export interface IEmailService {
    sendEmail(options: EmailOptions): Promise<void>;
}
