import nodemailer from "nodemailer"
import { emailTemplates } from "./emailTemplates"

// Create a test account for development
// In production, you would use real SMTP credentials
const createTransporter = async () => {
  // For development, create a test account
  const testAccount = await nodemailer.createTestAccount()
console.log(testAccount)
  // Create a transporter
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.ethereal.email",
    port: Number.parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER || testAccount.user,
      pass: process.env.EMAIL_PASS || testAccount.pass,
    },
  })
}

interface SendEmailParams {
  to: string;
  candidateName: string;
  recruiterName: string;
  stage: string;
  status: string;
  reason?: string;
  recruiterEmail?: string;
}

export const sendEmail = async ({
  to,
  candidateName,
  recruiterName,
  recruiterEmail,
  stage,
  status,
  reason,
}: SendEmailParams): Promise<{
  success: boolean;
  messageUrl?: string | undefined;
  error?: any;
}> => {
  try {
    const transporter = await createTransporter();

    // Get the email template
    const template = emailTemplates[stage]?.[status];
    if (!template) {
      throw new Error(
        `No email template found for stage: ${stage}, status: ${status}`
      );
    }

    // Customize the sender name based on the recruiter
    const senderName = `${recruiterName}, Punch Digital Recruiter`;
    const senderEmail = `${recruiterEmail}`;
    const from = `"${senderName}" <${senderEmail}>`;

    // Send the email
    const info = await transporter.sendMail({
      from,
      to,
      subject: template.subject,
      text: template.body({ candidateName, recruiterName, reason }),
    });

    console.log(`Email sent: ${info.messageId}`);

    // Get URL for Ethereal Email (for development)
    const messageUrl = nodemailer.getTestMessageUrl(info);
    console.log(`Preview URL: ${messageUrl}`);

    return { success: true, messageUrl: messageUrl || undefined };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};
