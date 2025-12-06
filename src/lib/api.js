// src/lib/api.js

export const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      data?.error ||
      data?.message ||
      `API Error: ${res.status} ${res.statusText}`;
    throw new Error(message);
  }

  return data;
}
