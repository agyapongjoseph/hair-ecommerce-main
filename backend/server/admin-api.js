// src/server/admin-api.js
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env');
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// multer for file uploads (memory)
const upload = multer({ storage: multer.memoryStorage() });

// Simple admin header-based guard for dev
function adminAuth(req, res, next) {
  const key = req.headers['x-admin-key'] || req.query.admin_key;
  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

/*
Expect Excel columns (flexible):
name, description, price, stock, category, image_url, lengths (comma separated), colors (comma separated), textures
*/
app.post('/admin/upload-products', adminAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: null });

    const results = { inserted: 0, updated: 0, errors: [] };

    for (const row of rows) {
      try {
        // normalize fields
        const name = (row.name || row.product || '').toString().trim();
        if (!name) {
          results.errors.push({ row, error: 'Missing product name' });
          continue;
        }
        const description = row.description || '';
        const price = row.price ? Number(row.price) : 0;
        const stock = row.stock ? parseInt(row.stock, 10) : 0;
        const category = row.category || 'uncategorized';
        const image_url = row.image_url || row.image || null;

        const lengths = (row.lengths || row.length || '').toString()
          .split(',').map(s => s.trim()).filter(Boolean);
        const colors = (row.colors || row.color || '').toString()
          .split(',').map(s => s.trim()).filter(Boolean);
        const textures = row.textures || row.texture || null;

        // attempt to find existing product by name OR image_url
        let q = supabase
          .from('products')
          .select('*')
          .limit(1)
          .ilike('name', name); // case-insensitive match

        // if image_url provided also try to match by exact image_url
        if (image_url) {
          // try by image_url first
          const { data: byImage } = await supabase
            .from('products')
            .select('*')
            .eq('image_url', image_url)
            .limit(1);

          if (byImage && byImage.length) {
            // update that row
            const pid = byImage[0].id;
            const { error: errUpdate } = await supabase
              .from('products')
              .update({
                name, description, price, stock, category, image_url,
                lengths: lengths.length ? lengths : null,
                colors: colors.length ? colors : null,
                textures: textures || null
              })
              .eq('id', pid);
            if (errUpdate) throw errUpdate;
            results.updated += 1;
            continue;
          }
        }

        const { data: byName } = await supabase
          .from('products')
          .select('*')
          .ilike('name', name)
          .limit(1);

        if (byName && byName.length) {
          // update existing by id
          const pid = byName[0].id;
          const { error: errUpdate } = await supabase
            .from('products')
            .update({
              description, price, stock, category, image_url,
              lengths: lengths.length ? lengths : null,
              colors: colors.length ? colors : null,
              textures: textures || null
            })
            .eq('id', pid);
          if (errUpdate) throw errUpdate;
          results.updated += 1;
        } else {
          // insert new product
          const { error: errInsert } = await supabase
            .from('products')
            .insert([{
              name, description, price, stock, category, image_url,
              lengths: lengths.length ? lengths : null,
              colors: colors.length ? colors : null,
              textures: textures || null
            }]);
          if (errInsert) throw errInsert;
          results.inserted += 1;
        }
      } catch (rowErr) {
        results.errors.push({ row, error: rowErr.message || rowErr });
      }
    }

    res.json({ message: 'Upload completed', results });
  } catch (err) {
    console.error('upload-products error', err);
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

// GET products (admin) with pagination
app.get('/admin/products', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const per_page = parseInt(req.query.per_page || '50', 10);
    const from = (page - 1) * per_page;
    const to = from + per_page - 1;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH product by id (update stock/price/fields)
app.patch('/admin/products/:id', adminAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    // sanitize arrays if empty string
    if (updates.lengths && !Array.isArray(updates.lengths)) {
      updates.lengths = updates.lengths.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (updates.colors && !Array.isArray(updates.colors)) {
      updates.colors = updates.colors.split(',').map(s => s.trim()).filter(Boolean);
    }
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE product by id
app.delete('/admin/products/:id', adminAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Orders
app.get('/admin/orders', adminAuth, async (req, res) => {
  try {
    // join orders -> order_items and product names via two separate selects (Supabase doesn't support complex joins easily without SQL)
    const { data: orders, error: ordersErr } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersErr) throw ordersErr;

    // fetch order_items for these orders
    const orderIds = orders.map(o => o.id);
    const { data: items } = await supabase
      .from('order_items')
      .select('*')
      .in('order_id', orderIds);

    // attach items to orders
    const ordersWithItems = orders.map(o => ({
      ...o,
      items: (items || []).filter(i => i.order_id === o.id)
    }));

    res.json({ data: ordersWithItems });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/admin/orders/:id', adminAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Customers (users table)
app.get('/admin/customers', adminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role, created_at');

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/admin/customers/:id', adminAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Server start
if (require.main === module) {
  const port = process.env.PORT || 8080;
  app.listen(port, () => console.log(`Admin API listening on ${port}`));
}

module.exports = app;
