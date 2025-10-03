import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";

export default function AdminUploadProducts() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        // send JSON array to backend
        const res = await fetch(
          `${import.meta.env.VITE_ADMIN_API_BASE}/admin/upload-products`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-admin-key": import.meta.env.VITE_ADMIN_KEY,
            },
            body: JSON.stringify({ products: rows }),
          }
        );

        const result = await res.json();

        if (!res.ok) {
          console.error("Upload failed:", result);
          alert("❌ Upload failed: " + (result.error || "Server error"));
        } else {
          // results structure: { message, results: { inserted, updated, errors } }
          const inserted = result.results?.inserted ?? 0;
          const updated = result.results?.updated ?? 0;
          const errors = result.results?.errors ?? [];

          alert(`✅ Upload complete — inserted ${inserted}, updated ${updated}.`);
          // notify other components (AdminProductsTable, etc.) to refresh
          window.dispatchEvent(new CustomEvent("products:updated"));
          if (errors.length) {
            console.warn("Upload errors:", errors);
          }
        }
      } catch (err) {
        console.error("Upload error:", err);
        alert("❌ Error uploading products");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h2 className="font-semibold mb-2">Upload Products (Excel/CSV)</h2>
      <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
      <Button className="mt-2" onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
}
