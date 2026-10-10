import { GOOGLE_MAPS_API_KEY } from "../config";

/**
 * One place for every Google web-service call (Routes and Places).
 * Adds the key and field mask, and turns API errors into readable messages.
 */
export async function googleFetch(url, { method = "GET", body, fieldMask, signal } = {}) {
  const headers = { "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY };
  if (body) headers["Content-Type"] = "application/json";
  if (fieldMask) headers["X-Goog-FieldMask"] = fieldMask;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error?.message || `Google request failed (${res.status}).`);
  }
  return data;
}
