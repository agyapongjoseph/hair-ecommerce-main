// backend/utils/sendEmail.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderEmail(to, orderId, total) {
  try {
    await resend.emails.send({
      from: "Your Shop <no-reply@yourdomain.com>",
      to,
      subject: "Payment Confirmed",
      html: `
        <h2>Payment Successful 🎉</h2>
        <p>Your order <strong>${orderId}</strong> has been paid successfully.</p>
        <p><strong>Total:</strong> ₵${total}</p>
        <p>Thank you for shopping with us!</p>
      `,
    });
    console.log("✅ Email sent successfully");
  } catch (err) {
    console.error("❌ Email sending failed:", err);
  }
}
