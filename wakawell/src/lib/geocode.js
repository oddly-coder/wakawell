import { GEOCODER } from "../config";

// Place search. Nominatim's public server allows about 1 request per second.
export async function searchPlaces(text, signal) {
  const res = await fetch(
    `${GEOCODER}?format=jsonv2&limit=5&q=${encodeURIComponent(text)}`,
    { signal }
  );
  const data = await res.json();
  return data.map((r) => ({
    id: r.place_id,
    full: r.display_name,
    lng: parseFloat(r.lon),
    lat: parseFloat(r.lat),
    label: r.display_name.split(",").slice(0, 2).join(","),
  }));
}
