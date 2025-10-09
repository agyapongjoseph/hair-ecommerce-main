// backend/utils/sendEmail.js
import nodemailer from "nodemailer";

export async function sendEmail(to, subject, html) {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or "Outlook", "Yahoo", etc.
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Farida Abdul Hair" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📩 Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email error:", err);
  }
}
