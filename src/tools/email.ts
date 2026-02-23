import { z } from 'zod';
import { createTool } from '../tools';
import nodemailer from 'nodemailer';

export const sendEmail = createTool({
    id: 'send_email',
    description: 'Send an email via SMTP',
    parameters: z.object({
        to: z.string().email(),
        subject: z.string(),
        body: z.string(),
        smtpHost: z.string().optional(),
        smtpPort: z.number().optional(),
        user: z.string().optional(),
        pass: z.string().optional()
    }),
    execute: async (args) => {
        const transporter = nodemailer.createTransport({
            host: args.smtpHost || process.env.SMTP_HOST,
            port: args.smtpPort || Number(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: args.user || process.env.SMTP_USER,
                pass: args.pass || process.env.SMTP_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: args.user || process.env.SMTP_USER,
            to: args.to,
            subject: args.subject,
            text: args.body,
        });

        return { success: true, messageId: info.messageId };
    }
});
