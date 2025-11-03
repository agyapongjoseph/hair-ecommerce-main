// backend/index.js
import express from "express";
import cors from "cors";
import 'dotenv/config';
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "./utils/sendEmail.js";
import allRoutes from "./server/allRoutes.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
// dotenv.config({ path: path.join(__dirname, ".env") });

// --- Express app setup ---
const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || "https://hair-ecommerce-main.vercel.app";
// Define allowed origins list (for prod + local dev)
const allowedOrigins = [
  FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:8081",
];

app.use(cors())
app.use(express.json({ limit: "10mb" }));

app.use(allRoutes)// New admin router

// --- Supabase setup ---
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// --- Simple Admin Header Guard ---
function adminAuth(req, res, next) {
  const key = (req.headers["x-admin-key"] || "").toString();
  if (!key || key !== (process.env.ADMIN_KEY || "").toString()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// =============== SUPABASE PRODUCT ROUTES ===============

console.log("🧠 uploadProducts file loaded");

// Upload products
// ✅ Improved Upload Products Endpoint
app.post("/admin/upload-products", adminAuth, async (req, res) => {
  try {
    const rows = req.body?.products;
    if (!rows || !Array.isArray(rows)) {
      return res.status(400).json({ error: "Invalid body" });
    }

    const results = { inserted: 0, updated: 0, errors: [] };

    for (const row of rows) {
      try {
        const name = (row.name || "").trim();
        if (!name) continue;

        const description = row.description || null;
        const stock = Number(row.stock) || 0;
        const category = row.category || null;
        const image_url = row.image_url || null;

        // Normalize arrays
        const lengths = (row.lengths ?? "")
          .toString()
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

        const colors = (row.colors ?? "")
          .toString()
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

        const sizes = (row.sizes ?? "")
          .toString()
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

        const textures = row.textures || null;

        // ✅ Case-insensitive name check (trimmed)
        const { data: existing, error: fetchError } = await supabase
          .from("products")
          .select("id, name")
          .ilike("name", name)
          .maybeSingle();

        if (fetchError) throw fetchError;

        const productData = {
          name,
          description,
          stock,
          category,
          image_url,
          lengths: lengths.length ? lengths : null,
          colors: colors.length ? colors : null,
          sizes: sizes.length ? sizes : null,
          textures,
        };

        if (existing?.id) {
          // ✅ Update existing record
          const { error: updateError } = await supabase
            .from("products")
            .update(productData)
            .eq("id", existing.id);
          if (updateError) throw updateError;
          results.updated++;
        } else {
          // ✅ Insert new record
          const { error: insertError } = await supabase
            .from("products")
            .insert([productData]);
          if (insertError) throw insertError;
          results.inserted++;
        }
      } catch (err) {
        console.error("❌ Upload error for product:", row.name, err.message);
        results.errors.push({ name: row.name, error: err.message });
      }
    }

    return res.json({
      message: "✅ Upload complete",
      results,
    });
  } catch (err) {
    console.error("❌ Server upload error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});


// Public product list
app.get("/products", async (req, res) => {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data || []);
});

// Admin product list
app.get("/admin/products", adminAuth, async (req, res) => {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data || []);
});

// Update product
app.patch("/admin/products/:id", adminAuth, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  if (updates.colors && !Array.isArray(updates.colors)) {
    updates.colors = updates.colors.split(",").map((s) => s.trim());
  }
  const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

// Delete product
app.delete("/admin/products/:id", adminAuth, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ message: "Deleted", id });
});

// =============== HUBTEL PAYMENT ROUTES ===============

// Checkout
app.post("/checkout", async (req, res) => {
  try {
    const { customer, items, total } = req.body;
    let msisdn = customer.phone || "";
    if (msisdn.startsWith("0")) msisdn = "233" + msisdn.slice(1);

    const clientReference = `ORDER-${Date.now()}`;
    const payload = {
      totalAmount: Number(total).toFixed(2),
      description: `Order - ${items.length} items`,
      callbackUrl: process.env.CALLBACK_URL,
      returnUrl: process.env.RETURN_URL,
      cancellationUrl: process.env.CANCEL_URL,
      merchantAccountNumber: process.env.HUBTEL_MERCHANT_ID,
      clientReference,
      payeeName: customer.name,
      payeeMobileNumber: msisdn,
      payeeEmail: customer.email,
      paymentMethod: "ALL",
    };

    const auth = Buffer.from(
      `${process.env.HUBTEL_CLIENT_ID}:${process.env.HUBTEL_CLIENT_SECRET}`
    ).toString("base64");

    const resp = await fetch("https://payproxyapi.hubtel.com/items/initiate", {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await resp.text();
    let hubtelData;
    try { hubtelData = JSON.parse(text); } catch { throw new Error("Invalid Hubtel response"); }

    if (!resp.ok || !hubtelData?.data?.checkoutUrl) {
      return res.status(400).json({ error: hubtelData.message || hubtelData });
    }

    // 🚀 Save pending order in Supabase (optional)
    await supabase.from("orders").insert([{
      clientReference,
      items,
      total,
      status: "PENDING",
    }]);

    return res.json({
      checkoutUrl: hubtelData.data.checkoutUrl,
      clientReference,
      checkoutId: hubtelData.data.checkoutId,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Hubtel callback
app.post("/hubtel/callback", async (req, res) => {
  try {
    console.log("=== Hubtel callback ===", req.body);
    const clientReference =
      req.body?.Data?.ClientReference || req.body?.clientReference;
    const status = req.body?.Status || req.body?.Data?.Status;

    if (clientReference) {
      const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .eq("clientReference", clientReference)
        .limit(1);

      if (orders?.length) {
        const order = orders[0];
        await supabase
          .from("orders")
          .update({ status })
          .eq("clientReference", clientReference);

        // ✅ Send confirmation only if payment was successful
        if (status === "Success" || status === "PAID") {
          const productList = order.items
            .map(
              (it) =>
                `<li>${it.name} × ${it.quantity} — ₵${(
                  it.price * it.quantity
                ).toFixed(2)}</li>`
            )
            .join("");

          // 🧩 1️⃣ Reduce stock in Supabase
          for (const item of order.items) {
            const { data: product, error: fetchErr } = await supabase
              .from("products")
              .select("id, stock")
              .eq("id", item.id)
              .single();

            if (!fetchErr && product) {
              const newStock = Math.max((product.stock || 0) - item.quantity, 0);
              const { error: updateErr } = await supabase
                .from("products")
                .update({ stock: newStock })
                .eq("id", item.id);
              if (updateErr) console.error("⚠️ Stock update failed:", updateErr);
            } else {
              console.error("⚠️ Product not found or fetch error:", fetchErr);
            }
          }

          // 🧩 2️⃣ Update order to paid
          await supabase
            .from("orders")
            .update({ status: "PAID" })
            .eq("clientReference", clientReference);

          // 🧩 3️⃣ Send confirmation email
          const html = `
            <h2>Payment Successful 🎉</h2>
            <p>Dear ${order.customer_name},</p>
            <p>We’ve received your payment for order <strong>${clientReference}</strong>.</p>
            <p><strong>Total Paid:</strong> ₵${Number(order.total).toFixed(2)}</p>
            <h3>Items:</h3>
            <ul>${productList}</ul>
            <p>Thank you for shopping with Farida Abdul Hair!</p>
          `;

          if (order.customer_email) {
            sendEmail(order.customer_email, "Payment Confirmed", html);
          }

          console.log("✅ Payment successful — stock updated.");
        }

      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Hubtel callback error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Check status
app.get("/check-status/:clientReference", async (req, res) => {
  try {
    const { clientReference } = req.params;
    const auth = Buffer.from(`${process.env.HUBTEL_CLIENT_ID}:${process.env.HUBTEL_CLIENT_SECRET}`).toString("base64");
    const POS_SALES_ID = process.env.HUBTEL_POS_SALES_ID;
    const url = `https://api-txnstatus.hubtel.com/transactions/${POS_SALES_ID}/status?clientReference=${clientReference}`;
    const response = await fetch(url, { headers: { Authorization: `Basic ${auth}` } });
    const data = await response.json();
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
// 🧪 Temporary test endpoint — remove after verifying email works
app.post("/test-email", async (req, res) => {
  const { to, subject, html } = req.body || {};
  if (!to) return res.status(400).json({ error: "to required" });
  try {
    const result = await sendEmail(
      to,
      subject || "Test email",
      html || "<p>Hi — test</p>"
    );
    return res.json({ ok: true, result });
  } catch (err) {
    console.error("test-email error:", err);
    return res.status(500).json({ error: err.message || String(err) });
  }
});

// =============== START SERVER ===============
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
