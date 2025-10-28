// src/lib/api.ts
export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  // Always include /api/ in every call
  const base =
    import.meta.env.VITE_BACKEND_URL || "https://hair-ecommerce-backend.onrender.com";

  // Ensure path starts correctly
  const fullPath = path.startsWith("/api/") ? path : `/api${path}`;

  const res = await fetch(base + fullPath, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `API error: ${res.status}`);
  }

  return res.json();
}
