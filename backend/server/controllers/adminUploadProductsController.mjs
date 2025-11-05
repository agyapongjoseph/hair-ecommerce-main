import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("🧠 adminUploadProductsController loaded");

export const uploadProducts = async (req, res) => {
  console.log("🚀 uploadProducts triggered");

  const adminKey = req.headers["x-admin-key"];
  if (adminKey !== process.env.ADMIN_KEY) {
    console.log("❌ Unauthorized request");
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { products } = req.body;
  if (!Array.isArray(products)) {
    console.log("❌ Invalid format received");
    return res.status(400).json({ error: "Invalid format" });
  }

  let inserted = 0;
  let updated = 0;
  const errors = [];

  // helper to safely parse array-like strings
  const parseArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      return value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    }
    return [];
  };

  for (const p of products) {
    try {
      const {
        name,
        description,
        category,
        image_url,
        image_urls, // ✅ capture from Excel
        stock,
        colors,
        sizes,
        texture,
        ...rest
      } = p;

      if (!name) continue;

      const length_prices = Object.entries(rest)
        .filter(([key]) => key.startsWith("length_") && rest[key] !== "")
        .map(([key, value]) => {
          const length = key.replace("length_", "");
          const previous_price = rest[`prev_${length}`];
          return {
            length,
            price: Number(value) || 0,
            previous_price: previous_price ? Number(previous_price) : null,
          };
        });

      const lengths = length_prices.map((lp) => lp.length);

      // 🔍 Check existing product
      const { data: existing, error: fetchError } = await supabase
        .from("products")
        .select("id, name")
        .eq("name", name.trim())
        .maybeSingle();

      if (fetchError) throw fetchError;

      // ✅ Build final product data (with image_urls array)
      const productData = {
        name: name.trim(),
        description: description || null,
        category: category || null,
        image_url: image_url || null,
        stock: Number(stock) || 0,
        colors: parseArray(colors),
        sizes: parseArray(sizes),
        textures: texture || null,
        lengths,
        length_prices,
        image_urls: parseArray(image_urls), // ✅ key fix
      };

      if (existing) {
        console.log(`🔄 Updating product: ${name}`);
        const { error: updateError } = await supabase
          .from("products")
          .update(productData)
          .eq("id", existing.id);
        if (updateError) throw updateError;
        updated++;
      } else {
        console.log(`🆕 Inserting new product: ${name}`);
        const { error: insertError } = await supabase
          .from("products")
          .insert([productData]);
        if (insertError) throw insertError;
        inserted++;
      }
    } catch (err) {
      console.error("❌ Error saving product:", err.message);
      errors.push({ name: p.name, error: err.message });
    }
  }

  console.log(`✅ Upload complete — Inserted: ${inserted}, Updated: ${updated}`);
  return res.json({
    message: "✅ Upload complete",
    results: { inserted, updated, errors },
  });
};
