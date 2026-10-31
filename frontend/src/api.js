export const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_URL is not configured.");
}

export async function apiRequest(path, { method = "GET", data, token } = {}) {
  const headers = {};

  if (data !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Token ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`,
    {
      method,
      headers,
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }
  );

  if (response.status === 204) {
    return null;
  }

  const result = await response.json();

  if (!response.ok) {
    const message = Object.entries(result)
      .map(([field, value]) => {
        const text = Array.isArray(value) ? value.join(" ") : String(value);
        return field === "detail" ? text : `${field}: ${text}`;
      })
      .join(" ");

    const error = new Error(message || "Request failed.");
    error.status = response.status;
    throw error;
  }

  return result;
}