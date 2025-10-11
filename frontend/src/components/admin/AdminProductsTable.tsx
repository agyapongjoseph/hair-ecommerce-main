// src/components/admin/AdminProductsTable.tsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Product = {
  id: string;
  name: string;
  price: number;
  previous_price?: number;
  stock: number;
  category?: string;
  lengths?: string[] | null;
};

export default function AdminProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    previous_price: "",
    stock: "",
    lengths: "",
  });

  console.log("Products state:", products);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://hair-ecommerce-main.onrender.com/api/products/all`, {
        headers: { "x-admin-key": import.meta.env.VITE_ADMIN_KEY },
      });
      if (!res.ok) throw new Error("Failed to fetch admin products");
      const json = await res.json();
      console.log("Fetched products:", json);
      setProducts(json);
    } catch (err) {
      console.error("fetchProducts error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    const handler = () => fetchProducts();
    window.addEventListener("products:updated", handler);
    return () => window.removeEventListener("products:updated", handler);
  }, []);

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setFormData({
      name: p.name,
      price: String(p.price),
      previous_price: p.previous_price ? String(p.previous_price) : "",
      stock: String(p.stock),
      lengths: Array.isArray(p.lengths) ? p.lengths.join(", ") : "",
    });
  };

  const handleSave = async (id: string) => {
    try {
      const updates = {
        name: formData.name,
        price: Number(formData.price),
        previous_price: formData.previous_price
          ? Number(formData.previous_price)
          : null,
        stock: Number(formData.stock),
        lengths: formData.lengths
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const res = await fetch(
        `${import.meta.env.VITE_ADMIN_API_BASE}/admin/products/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": import.meta.env.VITE_ADMIN_KEY,
          },
          body: JSON.stringify(updates),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || "Failed to update product");
      }

      setEditingId(null);
      fetchProducts();
      window.dispatchEvent(new CustomEvent("products:updated"));
    } catch (err) {
      console.error("Edit error:", err);
      alert("❌ Could not edit product");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_ADMIN_API_BASE}/admin/products/${id}`,
        {
          method: "DELETE",
          headers: { "x-admin-key": import.meta.env.VITE_ADMIN_KEY },
        }
      );
      if (!res.ok) throw new Error("Failed to delete product");
      fetchProducts();
      window.dispatchEvent(new CustomEvent("products:updated"));
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Could not delete product");
    }
  };

  const EditForm = ({ product }: { product: Product }) => (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-3">
      <h3 className="text-sm font-semibold mb-3 text-gray-700">Edit Product</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Input
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Price"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Previous Price"
          value={formData.previous_price}
          onChange={(e) =>
            setFormData({ ...formData, previous_price: e.target.value })
          }
        />
        <Input
          type="number"
          placeholder="Stock"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
        />
        <Input
          placeholder="Lengths (comma separated)"
          className="sm:col-span-2 lg:col-span-2"
          value={formData.lengths}
          onChange={(e) => setFormData({ ...formData, lengths: e.target.value })}
        />
      </div>
      <div className="flex gap-2 mt-3">
        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
          Cancel
        </Button>
        <Button size="sm" onClick={() => handleSave(product.id)}>
          Save Changes
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-4 border rounded-lg shadow-sm bg-white mt-4">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-3 text-gray-600">Loading products...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 border rounded-lg shadow-sm bg-white mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Products</h2>
        <span className="text-sm text-gray-500">{products.length} items</span>
      </div>

      {/* Desktop table view */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-sm font-semibold">Name</th>
              <th className="p-3 text-sm font-semibold">Category</th>
              <th className="p-3 text-sm font-semibold">Price</th>
              <th className="p-3 text-sm font-semibold">Was</th>
              <th className="p-3 text-sm font-semibold">Stock</th>
              <th className="p-3 text-sm font-semibold">Lengths</th>
              <th className="p-3 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <React.Fragment key={p.id}>
                <tr className="border-t hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 text-gray-600">{p.category || "-"}</td>
                  <td className="p-3 font-semibold text-green-600">₵{p.price}</td>
                  <td className="p-3 text-gray-500 text-sm">
                    {p.previous_price ? (
                      <span className="line-through">₵{p.previous_price}</span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        p.stock > 10
                          ? "bg-green-100 text-green-800"
                          : p.stock > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {Array.isArray(p.lengths) ? p.lengths.join(", ") : "-"}
                  </td>
                  <td className="p-3 space-x-2">
                    <Button size="sm" onClick={() => startEdit(p)}>
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
                {editingId === p.id && (
                  <tr>
                    <td colSpan={7} className="p-0">
                      <div className="p-4 bg-blue-50 border-t-2 border-blue-200">
                        <EditForm product={p} />
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet card view */}
      <div className="lg:hidden space-y-4">
        {products.map((p) => (
          <div key={p.id} className="border rounded-lg bg-white shadow-sm">
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-base mb-1">{p.name}</h3>
                  {p.category && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {p.category}
                    </span>
                  )}
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                    p.stock > 10
                      ? "bg-green-100 text-green-800"
                      : p.stock > 0
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  Stock: {p.stock}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Current Price</p>
                  <p className="font-semibold text-green-600">₵{p.price}</p>
                </div>
                {p.previous_price && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Previous Price</p>
                    <p className="text-gray-500 line-through text-sm">
                      ₵{p.previous_price}
                    </p>
                  </div>
                )}
              </div>

              {p.lengths && Array.isArray(p.lengths) && p.lengths.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Available Lengths</p>
                  <div className="flex flex-wrap gap-1">
                    {p.lengths.map((length, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                      >
                        {length}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-3 border-t">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => startEdit(p)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </Button>
              </div>
            </div>

            {editingId === p.id && (
              <div className="border-t">
                <div className="p-4 bg-blue-50">
                  <EditForm product={p} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">No products found</p>
          <p className="text-sm text-gray-400">Add your first product to get started</p>
        </div>
      )}
    </div>
  );
}