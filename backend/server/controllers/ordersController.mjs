// server/routes/admin.js
import express from "express";
import { Router } from "express"; 
import { createClient } from "@supabase/supabase-js";


const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export const getAllOrders = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
    console.log("Fetched all orders:", data); // Debug log
  } catch (err) {
    console.error("🔥 Error fetching all orders:", err.message);
    res.status(500).json({ error: err.message });
  }
};


export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .update({ status })
    .select("id, user_id, status, total, created_at")
    .eq("id", id)
    .single();

  if (orderError) return res.status(400).json({ error: orderError.message });

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("id, product_id, quantity, price, products(name)")
    .eq("order_id", id);

  if (itemsError) return res.status(400).json({ error: itemsError.message });

  res.json({ ...order, items });

};
