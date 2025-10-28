// src/services/admin.ts
import axios from 'axios';

const ADMIN_API_BASE = import.meta.env.VITE_ADMIN_API_BASE || 'https://hair-ecommerce-backend.onrender.com';

const adminApi = axios.create({
  baseURL: ADMIN_API_BASE,
  headers: {
    'x-admin-key': import.meta.env.VITE_ADMIN_KEY || ''
  }
});

export const uploadProductsExcel = (file: File) => {
  const fd = new FormData();
  fd.append('file', file);
  return adminApi.post('/admin/upload-products', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const fetchAdminProducts = (page = 1, per_page = 50) =>
  adminApi.get(`/admin/products?page=${page}&per_page=${per_page}`);

export const updateProduct = (id: string, updates: any) =>
  adminApi.patch(`/admin/products/${encodeURIComponent(id)}`, updates);

export const deleteProduct = (id: string) =>
  adminApi.delete(`/admin/products/${encodeURIComponent(id)}`);

export const fetchOrders = () => adminApi.get('/admin/orders');
export const updateOrder = (id: string, updates: any) =>
  adminApi.patch(`/admin/orders/${id}`, updates);

export const fetchCustomers = () => adminApi.get('/admin/customers');
export const updateCustomer = (id: string, updates: any) =>
  adminApi.patch(`/admin/customers/${id}`, updates);
