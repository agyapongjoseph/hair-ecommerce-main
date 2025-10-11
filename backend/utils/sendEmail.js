// // backend/utils/sendEmail.js
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function sendEmail(to, subject, html) {
//   try {
//     const data = await resend.emails.send({
//       from: process.env.EMAIL_FROM || "onboarding@resend.dev",
//       to,
//       subject,
//       html,
//     });
//     console.log("✅ Email sent:", data);
//     return data;
//   } catch (err) {
//     console.error("❌ Email error:", err);
//     throw err;
//   }
// }
