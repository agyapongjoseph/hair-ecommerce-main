// backend/utils/sendEmail.js
import { Resend } from "resend";
import nodemailer from "nodemailer";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || "no-reply@yourdomain.com";

let resendClient = null;
if (RESEND_API_KEY) {
  resendClient = new Resend(RESEND_API_KEY);
}

export async function sendEmail(to, subject, html) {
  if (!to) throw new Error("No recipient specified for sendEmail");

  // Primary: Resend API
  if (resendClient) {
    try {
      await resendClient.emails.send({
        from: EMAIL_FROM,
        to,
        subject,
        html,
      });
      return { ok: true, provider: "resend" };
    } catch (err) {
      console.error("Resend send error:", err);
      throw err;
    }
  }

  // Fallback: Nodemailer (only use if you configured SMTP env vars)
  const SMTP_HOST = process.env.EMAIL_HOST;
  if (!SMTP_HOST) {
    throw new Error("No email provider configured (no RESEND_API_KEY or SMTP settings)");
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // reduce the risk of ETIMEDOUT by increasing timeouts:
    connectionTimeout: 30_000,
    greetingTimeout: 10_000,
    socketTimeout: 30_000,
  });

  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    });
    return { ok: true, provider: "smtp" };
  } catch (err) {
    console.error("Nodemailer send error:", err);
    throw err;
  }
}
