import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export async function sendEmail({
    to,
    subject,
    html,
    cc,
    attachments,
}: {
    to: string;
    subject: string;
    html: string;
    cc?: string[];
    attachments?: { filename: string; content: Buffer | string }[];
}) {
    try {
        const mailOptions = {
            from: `"LeBazare" <${process.env.GMAIL_USER}>`,
            to,
            cc,
            subject,
            html,
            attachments,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
}
