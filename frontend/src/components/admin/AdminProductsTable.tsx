import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LengthPrice = {
  length: string;
  price: number;
  previous_price?: number | null;
};

type Product = {
  id: string;
  name: string;
  stock: number;
  category?: string;
  lengths?: string[] | null;
  length_prices?: LengthPrice[];
};

export default function AdminProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    stock: "",
    lengths: "",
    length_prices: [] as LengthPrice[],
  });

  // ✅ Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://hair-ecommerce-backend.onrender.com/api/products/all`, {
        headers: { "x-admin-key": import.meta.env.VITE_ADMIN_KEY },
      });
      if (!res.ok) throw new Error("Failed to fetch admin products");
      const json = await res.json();
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

  // ✅ Begin edit
  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setFormData({
      name: p.name || "",
      stock: String(p.stock || ""),
      lengths: Array.isArray(p.lengths) ? p.lengths.join(", ") : "",
      length_prices: p.length_prices ? [...p.length_prices] : [],
    });
  };

  // ✅ Safe input handler (prevents re-creation/focus loss)
  const handleFormChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ Update nested length_prices safely
  const handleLengthPriceChange = (index: number, key: keyof LengthPrice, value: string) => {
    setFormData((prev) => {
      const updated = prev.length_prices.map((lp, i) =>
        i === index
          ? {
              ...lp,
              [key]:
                key === "price" || key === "previous_price"
                  ? Number(value)
                  : value,
            }
          : lp
      );
      return { ...prev, length_prices: updated };
    });
  };

  const addLengthPrice = () => {
    setFormData((prev) => ({
      ...prev,
      length_prices: [...prev.length_prices, { length: "", price: 0 }],
    }));
  };

  const removeLengthPrice = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      length_prices: prev.length_prices.filter((_, i) => i !== index),
    }));
  };

  // ✅ Save changes
  const handleSave = async (id: string) => {
    try {
      const updates = {
        name: formData.name.trim(),
        stock: Number(formData.stock),
        lengths: formData.lengths
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        length_prices: formData.length_prices.filter((lp) => lp.length && lp.price),
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

  // ✅ Delete
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

  // ✅ Inline editor
  const EditForm = ({ product }: { product: Product }) => (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-3">
      <h3 className="text-sm font-semibold mb-3 text-gray-700">Edit Product</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Input
          placeholder="Name"
          value={formData.name}
          onChange={(e) => handleFormChange("name", e.target.value)}
        />
        <Input
          type="number"
          placeholder="Stock"
          value={formData.stock}
          onChange={(e) => handleFormChange("stock", e.target.value)}
        />
        <Input
          placeholder="Lengths (comma separated)"
          className="sm:col-span-2 lg:col-span-3"
          value={formData.lengths}
          onChange={(e) => handleFormChange("lengths", e.target.value)}
        />
      </div>

      {/* Length prices */}
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2 text-gray-700">Length Prices</h4>
        {formData.length_prices.map((lp, index) => (
          <div key={index} className="flex gap-2 mb-2 items-center border-b pb-2 last:border-0">
            <Input
              placeholder="Length (e.g. 12)"
              value={lp.length}
              onChange={(e) => handleLengthPriceChange(index, "length", e.target.value)}
              className="w-24"
            />
            <Input
              type="number"
              placeholder="Price"
              value={lp.price}
              onChange={(e) => handleLengthPriceChange(index, "price", e.target.value)}
              className="w-24"
            />
            <Input
              type="number"
              placeholder="Prev Price"
              value={lp.previous_price ?? ""}
              onChange={(e) => handleLengthPriceChange(index, "previous_price", e.target.value)}
              className="w-24"
            />
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeLengthPrice(index)}
            >
              ×
            </Button>
          </div>
        ))}
        <Button size="sm" variant="outline" onClick={addLengthPrice}>
          + Add Length Price
        </Button>
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

      <div className="overflow-x-auto">
        <table className="w-full text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-sm font-semibold">Name</th>
              <th className="p-3 text-sm font-semibold">Category</th>
              <th className="p-3 text-sm font-semibold">Stock</th>
              <th className="p-3 text-sm font-semibold">Lengths & Prices</th>
              <th className="p-3 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <React.Fragment key={p.id}>
                <tr className="border-t hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 text-gray-600">{p.category || "-"}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3 text-sm text-gray-700">
                    {p.length_prices && p.length_prices.length > 0 ? (
                      <ul className="space-y-1">
                        {p.length_prices.map((lp, i) => (
                          <li key={i}>
                            <span className="font-medium">{lp.length}"</span> — ₵
                            {lp.price}
                            {lp.previous_price && (
                              <span className="text-gray-400 line-through ml-2">
                                ₵{lp.previous_price}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "-"
                    )}
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
                    <td colSpan={5} className="p-0">
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

      {products.length === 0 && (
        <div className="text-center py-12 text-gray-500">No products found</div>
      )}
    </div>
  );
}
