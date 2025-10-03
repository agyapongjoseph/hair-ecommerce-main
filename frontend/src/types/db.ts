export type User = {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  previous_price?: number;
  stock: number;
  category?: string;
  image_url?: string;
  lengths?: string[] | null;
  colors?: string[] | null;
  textures?: string | null;
  created_at?: string;
};


export type Order = {
  id: string;
  user_id: string;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  total: number;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
};
