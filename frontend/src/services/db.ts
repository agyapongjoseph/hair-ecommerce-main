import { supabase } from "@/lib/supabaseClient";
import { User, Product, Order, OrderItem } from "@/types/db";


export type ProductDTO = {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  image_url?: string;
  lengths?: string[] | null;
  colors?: string[] | null;
  textures?: string | null;
  created_at?: string;
};

/* USERS */
export async function fetchUsers(): Promise<User[]> {
  const { data, error } = await supabase.from("users").select("*");
  if (error) throw error;
  return data as User[];
}

export async function createUser(user: Omit<User, "id" | "created_at">) {
  const { data, error } = await supabase.from("users").insert(user).select().single();
  if (error) throw error;
  return data as User;
}

/* PRODUCTS */

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data as Product[];
}

export async function createProduct(product: Omit<Product, "id" | "created_at">) {
  const { data, error } = await supabase.from("products").insert(product).select().single();
  if (error) throw error;
  return data as Product;
}

/* ORDERS */
export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data as Order[];
}

export async function createOrder(order: Omit<Order, "id" | "created_at">) {
  const { data, error } = await supabase.from("orders").insert(order).select().single();
  if (error) throw error;
  return data as Order;
}

/* ORDER ITEMS */
export async function fetchOrderItems(orderId: string): Promise<OrderItem[]> {
  const { data, error } = await supabase.from("order_items").select("*").eq("order_id", orderId);
  if (error) throw error;
  return data as OrderItem[];
}

export async function createOrderItem(item: Omit<OrderItem, "id">) {
  const { data, error } = await supabase.from("order_items").insert(item).select().single();
  if (error) throw error;
  return data as OrderItem;
}
