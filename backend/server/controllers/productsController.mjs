import express from "express";
import { Router } from "express"; 
import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export const getAllProducts = async (req, res) => {
  const adminKey = req.headers["x-admin-key"];

  // Protect the route
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
}