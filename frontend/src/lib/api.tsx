// src/lib/api.ts
export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const base = import.meta.env.VITE_BACKEND_URL || "https://hair-ecommerce-main.onrender.com";
  const res = await fetch(base + path, {
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
