import { OVERPASS, STOP_RADIUS_M } from "../config";
import { haversine } from "./geo";

async function query(q, signal) {
  const res = await fetch(OVERPASS, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "data=" + encodeURIComponent(q),
    signal,
  });
  if (!res.ok) throw new Error("The bus stop service is busy. Try again in a moment.");
  return res.json();
}

// Nearest bus stops around a { lng, lat } point, closest first
export async function fetchStops(center, signal) {
  const around = `(around:${STOP_RADIUS_M},${center.lat},${center.lng})`;
  const data = await query(
    `[out:json][timeout:20];(node${around}[highway=bus_stop];node${around}[public_transport=platform][bus=yes];);out body;`,
    signal
  );
  return data.elements
    .map((e) => ({
      id: e.id,
      lng: e.lon,
      lat: e.lat,
      label: e.tags?.name || "Bus stop (no name)",
      dist: haversine(center, { lat: e.lat, lng: e.lon }),
    }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 12);
}

// Bus lines that serve one stop. Coverage depends on how well your city's
// lines are mapped in OpenStreetMap.
export async function fetchLines(stopId, signal) {
  const data = await query(
    `[out:json][timeout:20];node(${stopId});rel(bn)[route=bus];out tags;`,
    signal
  );
  const names = data.elements
    .map((r) => {
      const t = r.tags || {};
      if (t.ref) return t.to ? `${t.ref} to ${t.to}` : t.ref;
      return t.name;
    })
    .filter(Boolean);
  return [...new Set(names)];
}
