import nodemailer from "nodemailer";
import * as postmark from "postmark";
import dotenv from "dotenv";

dotenv.config();

/**
 * Sends an email using Postmark (production) or NodeMailer (SMTP fallback).
 */
export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;
  const emailFrom = process.env.EMAIL_FROM || "noreply@horizonbank.com";

  try {
    // ─── 1. Try Postmark ───────────────────────────────────────────────────────
    if (postmarkToken) {
      console.log("📨 Sending email via Postmark...");
      const client = new postmark.ServerClient(postmarkToken);
      const result = await client.sendEmail({
        From: emailFrom,
        To: to,
        Subject: subject,
        TextBody: text,
        HtmlBody: html,
        MessageStream: "outbound",
      });
      console.log("✅ Postmark message sent:", result.MessageID);
      return result;
    }

    // ─── 2. Fallback to NodeMailer (SMTP) ──────────────────────────────────────
    console.log("🔄 Using NodeMailer SMTP...");
    
    let transporter;
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      console.log(`📡 Connecting to ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT || 587}...`);
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: Number(process.env.EMAIL_PORT) === 465,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: { rejectUnauthorized: false }, // Prevent issues with some SMTP servers
      });
    } else {
      console.log("🧪 Creating Ethereal testing account...");
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
    }

    const info = await transporter.sendMail({
      from: `"Horizon Banking" <${emailFrom}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ NodeMailer message sent: %s", info.messageId);
    if (info.messageId && nodemailer.getTestMessageUrl(info)) {
      console.log("🔗 Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error: any) {
    console.error("❌ Error sending email:", error);
    if (error.code) console.error("   Error Code:", error.code);
    if (error.response) console.error("   Error Response:", error.response);
    
    throw new Error(`Failed to send email: ${error.message || "Unknown error"}`);
  }
};
