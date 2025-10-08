// backend/routes/callback.js
import express from "express";

export default function callbackRoutes(supabase) {
  const router = express.Router();

  router.post("/hubtel/callback", async (req, res) => {
    try {
      const payload = req.body;
      console.log("🔔 Hubtel Callback:", payload);

      const orderId = payload?.Data?.PrimaryCallbackData?.order_id;
      const status = payload?.Data?.Status;

      if (!orderId || !status) {
        return res.status(400).json({ error: "Missing order_id or status" });
      }

      // Map Hubtel status to your order statuses
      const mappedStatus =
        status === "Paid"
          ? "paid"
          : status === "Cancelled"
          ? "cancelled"
          : "pending";

      const { error } = await supabase
        .from("orders")
        .update({ status: mappedStatus })
        .eq("id", orderId);

      if (error) throw error;

      console.log(`✅ Order ${orderId} updated to ${mappedStatus}`);
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("Callback error:", err);
      return res.status(500).json({ error: err.message });
    }
  });

  return router;
}
