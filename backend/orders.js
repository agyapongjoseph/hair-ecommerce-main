// backend/orders.js
import express from "express";
import { supabase } from "./supabaseClient.js";
import { sendEmail } from "./utils/sendEmail.js"; 

const router = express.Router();

// 🟢 Create new order
router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      total,
      items,
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      client_reference,
    } = req.body;

    // ✅ Validate required fields
    if (!total || !items) {
      return res
        .status(400)
        .json({ error: "Missing required fields: total or items" });
    }

    // ✅ Build order data
    const clientReference =
      client_reference || "REF-" + Date.now().toString(36).toUpperCase();

    let orderData = {
      total,
      items,
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      client_reference: clientReference,
      status: "pending",
    };

    // ✅ Validate user_id and check if it exists in Supabase
    if (
      typeof user_id === "string" &&
      /^[0-9a-fA-F-]{36}$/.test(user_id)
    ) {
      const { data: userCheck, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("id", user_id)
        .single();

      if (userError && userError.code !== "PGRST116") {
        // not found or query error
        console.warn("⚠️ Supabase user lookup error:", userError.message);
      }

      if (userCheck) {
        orderData.user_id = user_id;
      } else {
        console.warn("⚠️ user_id not found in users table — saving as guest order.");
      }
    } else {
      console.warn("⚠️ Invalid user_id format — saving as guest order.");
    }

    // ✅ Insert order into Supabase
    const { data, error } = await supabase
      .from("orders")
      .insert([orderData])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase insert error:", error);
      throw error;
    }

    console.log("✅ Order created:", data.id);

    // ✅ Send confirmation email if email provided
    if (data) {
  const order = data;

  const productList = order.items
    .map(
      (it) =>
        `<li>${it.name} × ${it.quantity} — ₵${(
          it.price * it.quantity
        ).toFixed(2)}</li>`
    )
    .join("");

  const html = `
    <h2>Order Confirmation</h2>
    <p>Dear ${order.customer_name},</p>
    <p>Thank you for shopping with us! Your order has been placed successfully.</p>
    <p><strong>Order Reference:</strong> ${order.client_reference}</p>
    <p><strong>Total:</strong> ₵${Number(order.total).toFixed(2)}</p>
    <h3>Items:</h3>
    <ul>${productList}</ul>
    <p>You can track your order anytime at:<br>
    <a href="${process.env.FRONTEND_URL}/track-order?ref=${order.client_reference}">
      Track My Order
    </a></p>
    <p>We'll notify you when your payment is confirmed.</p>
    <br>
    <p>– Farida Abdul Hair</p>
  `;

  if (order.customer_email) {
    sendEmail(order.customer_email, "Order Confirmation", html);
  }
}
    res.status(201).json(data);
  } catch (err) {
    console.error("🔥 Error creating order:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Get all orders for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("🔥 Error fetching orders:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Get orders by email (for guest tracking)
router.get("/guest/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .ilike("customer_email", email)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("🔥 Error fetching guest orders:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Get all orders (for admin)
router.get("/all", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("🔥 Error fetching all orders:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
