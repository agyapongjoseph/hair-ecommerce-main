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

 const fetchProducts = async () => {
  setLoading(true);
  try {
    const res = await fetch(
      `${import.meta.env.VITE_ADMIN_API_BASE}/admin/products`,
      {
        headers: { "x-admin-key": import.meta.env.VITE_ADMIN_KEY },
      }
    );
    if (!res.ok) throw new Error("Failed to fetch admin products");
    const json = await res.json();
    setProducts(json.data || []); // ✅ Access json.data instead of json directly
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

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white mt-4">
      <h2 className="font-semibold mb-2">Products</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Category</th>
              <th className="p-2">Price</th>
              <th className="p-2">Previous Price</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Lengths</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <React.Fragment key={p.id}>
                <tr className="border-t">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.category || "-"}</td>
                  <td className="p-2">₵{p.price}</td>
                  <td className="p-2">
                    {p.previous_price ? `₵${p.previous_price}` : "-"}
                  </td>
                  <td className="p-2">{p.stock}</td>
                  <td className="p-2">
                    {Array.isArray(p.lengths) ? p.lengths.join(", ") : "-"}
                  </td>
                  <td className="p-2 space-x-2">
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

                {/* Inline editable row */}
                {editingId === p.id && (
                  <tr className="bg-gray-50 border-t">
                    <td colSpan={7} className="p-4">
                      <div className="grid grid-cols-5 gap-3">
                        <Input
                          placeholder="Name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                        <Input
                          type="number"
                          placeholder="Price"
                          step = "0.01"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                        />
                        <Input
                          type="number"
                          placeholder="Previous Price"
                          value={formData.previous_price}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              previous_price: e.target.value,
                            })
                          }
                        />
                        <Input
                          type="number"
                          placeholder="Stock"
                          value={formData.stock}
                          onChange={(e) =>
                            setFormData({ ...formData, stock: e.target.value })
                          }
                        />
                        <Input
                          placeholder="Lengths (comma separated)"
                          value={formData.lengths}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              lengths: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                        <Button size="sm" onClick={() => handleSave(p.id)}>
                          Save
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
