// server/routes/hubtel.js
import express from "express";
const router = express.Router();

/**
 * Hubtel sends POST request to your callback URL
 * You must respond quickly with 200 OK
 */
router.post("/callback", async (req, res) => {
  try {
    console.log("=== Hubtel Callback Received ===");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);

    const { ResponseCode, Status, Data } = req.body;

    if (ResponseCode === "0000" && Status === "Success") {
      // ✅ Mark order as paid
      console.log("✅ Payment success for:", Data?.ClientReference);

      // Example: update DB order status
      // await db.updateOrder(Data.ClientReference, {
      //   status: "paid",
      //   transactionId: Data.CheckoutId,
      // });
    } else {
      // ❌ Mark order as failed/cancelled
      console.log("❌ Payment failed for:", Data?.ClientReference);

      // Example: update DB order status
      // await db.updateOrder(Data.ClientReference, {
      //   status: "failed",
      // });
    }

    // Respond 200 so Hubtel knows you received it
    res.status(200).send("OK");
  } catch (err) {
    console.error("Callback error:", err);
    res.status(500).send("Callback handler error");
  }
});

export default router;
