import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env');
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("🔑 Supabase client initialized in", process.env.SUPABASE_SERVICE_ROLE_KEY);

console.log("🧠 adminUploadProductsController loaded");

export const uploadProducts = async (req, res) => {
  console.log("🚀 uploadProducts triggered");

  const adminKey = req.headers["x-admin-key"];
  console.log("🔑 Admin Key received:", adminKey ? adminKey : "Not Provided");
  console.log("🔑 Expected Admin Key:", process.env.ADMIN_KEY); // For debugging
  console.log("🔑 Admin Key match:", adminKey === process.env.ADMIN_KEY);
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

  for (const p of products) {
    try {
      const {
        name,
        description,
        category,
        image_url,
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
          const length = key.replace
          ("length_", "");

          console.log(`Processing key: ${key}, length: ${length}, value: ${value}`);

          const previous_price = rest[`prev_${length}`];
          return {
            length,
            price: Number(value) || 0,
            previous_price: previous_price ? Number(previous_price) : null,
          };
        });

      const lengths = length_prices.map((lp) => lp.length);

      // 🔍 Use eq() instead of ilike() for exact match
      const { data: existing, error: fetchError } = await supabase
        .from("products")
        .select("id, name")
        .eq("name", name.trim())
        .maybeSingle();

        console.log(`🔍 Fetched existing product for "${name}":`, existing);
        console.log(`🔍 Fetch error for "${name}":`, fetchError);
      if (fetchError) throw fetchError;

      const productData = {
        name: name.trim(),
        description: description || null,
        category: category || null,
        image_url: image_url || null,
        stock: Number(stock) || 0,
        colors: colors ? colors.split(",").map((c) => c.trim()) : [],
        sizes: sizes ? sizes.split(",").map((s) => s.trim()) : [],
        textures: texture || null,
        lengths,
        length_prices,
      };

      if (existing) {
        console.log(`🔄 Updating product: ${name}`);
        await supabase.from("products").update(productData).eq("id", existing.id);
        updated++;
      } else {
        console.log(`🆕 Inserting new product: ${name}`);
        await supabase.from("products").insert([productData]);
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
