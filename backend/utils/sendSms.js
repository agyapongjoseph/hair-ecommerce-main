// backend/utils/sendSms.js
import fetch from "node-fetch";

export async function sendSms(to, message) {
  const payload = {
    from: "HairStore",
    to,
    content: message,
  };

  const auth = Buffer.from(
    `${process.env.HUBTEL_CLIENT_ID}:${process.env.HUBTEL_CLIENT_SECRET}`
  ).toString("base64");

  await fetch("https://sms.hubtel.com/v1/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
