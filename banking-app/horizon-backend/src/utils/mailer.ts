import nodemailer from "nodemailer";
import * as postmark from "postmark";
import dotenv from "dotenv";

dotenv.config();

/**
 * Sends an email using Postmark (production) or NodeMailer (fallback/development).
 */
export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;
  const postmarkFrom = process.env.POSTMARK_FROM_EMAIL || "noreply@horizonbank.com";

  try {
    // ─── 1. Try Postmark (Production) ──────────────────────────────────────────
    if (postmarkToken) {
      console.log("📨 Sending email via Postmark...");
      const client = new postmark.ServerClient(postmarkToken);
      const result = await client.sendEmail({
        From: postmarkFrom,
        To: to,
        Subject: subject,
        TextBody: text,
        HtmlBody: html,
        MessageStream: "outbound",
      });
      console.log("✅ Postmark message sent:", result.MessageID);
      return result;
    }

    // ─── 2. Fallback to NodeMailer (Development/SMTP) ──────────────────────────
    console.log("🔄 No Postmark token found. Falling back to NodeMailer...");
    
    let transporter;
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 587,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else {
      console.log("🧪 Creating Ethereal testing account...");
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const info = await transporter.sendMail({
      from: `"Horizon Banking" <${postmarkFrom}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ NodeMailer message sent: %s", info.messageId);

    // Preview only available when sending through an Ethereal account
    if (info.messageId && nodemailer.getTestMessageUrl(info)) {
      console.log("🔗 Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
