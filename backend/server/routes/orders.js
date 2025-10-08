// backend/server/routes/orders.js
import express from "express";

export default function orderRoutes(supabase, adminAuth) {
  const router = express.Router();

  // 🧾 Create a new order (customer)
  router.post("/", async (req, res) => {
    try {
      const { user_id, items, total, shipping_info, clientReference } = req.body;
      if (!items || !Array.isArray(items) || !total) {
        return res.status(400).json({ error: "Invalid order data" });
      }

      const { data, error } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user_id || null,
            items,
            total,
            shipping_info: shipping_info || null,
            clientReference: clientReference || `ORDER-${Date.now()}`,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return res.json(data);
    } catch (err) {
      console.error("Error creating order:", err);
      return res.status(500).json({ error: err.message });
    }
  });

  // 👤 Get all orders for a specific user
  router.get("/user/:user_id", async (req, res) => {
    try {
      const { user_id } = req.params;
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  // 🔍 Track a specific order by reference (for TrackOrder.tsx)
  router.get("/ref/:reference", async (req, res) => {
    try {
      const { reference } = req.params;

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("clientReference", reference)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: "Order not found" });
      }

      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  // 🔍 Track a specific order by internal ID (optional)
  router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  // 🧑‍💼 Admin: Get all orders
  router.get("/admin/all", adminAuth, async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  // 🧑‍💼 Admin: Update order status
  router.patch("/update-status/:id", adminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const validStatuses = ["pending", "paid", "shipped", "completed", "cancelled"];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }

      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return res.json({ message: "Status updated", order: data });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  return router;
}
