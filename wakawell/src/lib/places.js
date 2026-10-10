import { PLACES_URL, STOP_RADIUS_M } from "../config";
import { googleFetch } from "./google";
import { haversine } from "./geo";

/*
  Places API (New). Autocomplete and the Place Details call that follows it
  share one session token, which Google bills as a single session.
*/

export async function autocomplete(input, sessionToken, signal) {
  const data = await googleFetch(`${PLACES_URL}/places:autocomplete`, {
    method: "POST",
    body: { input, sessionToken },
    signal,
  });
  return (data.suggestions ?? [])
    .filter((s) => s.placePrediction)
    .map((s) => ({
      id: s.placePrediction.placeId,
      full: s.placePrediction.text.text,
      label: s.placePrediction.structuredFormat?.mainText?.text ?? s.placePrediction.text.text,
    }));
}

// Turns a place id from autocomplete into coordinates
export async function placeDetails(placeId, sessionToken, signal) {
  const d = await googleFetch(`${PLACES_URL}/places/${placeId}?sessionToken=${sessionToken}`, {
    fieldMask: "location,displayName",
    signal,
  });
  return { lat: d.location.latitude, lng: d.location.longitude, label: d.displayName?.text ?? "" };
}

// Nearest bus stops around a { lat, lng } point, closest first
export async function fetchStops(center, signal) {
  const data = await googleFetch(`${PLACES_URL}/places:searchNearby`, {
    method: "POST",
    fieldMask: "places.id,places.displayName,places.location",
    body: {
      includedTypes: ["bus_station", "bus_stop"],
      maxResultCount: 20,
      rankPreference: "DISTANCE",
      locationRestriction: {
        circle: {
          center: { latitude: center.lat, longitude: center.lng },
          radius: STOP_RADIUS_M,
        },
      },
    },
    signal,
  });
  return (data.places ?? [])
    .map((p) => {
      const pos = { lat: p.location.latitude, lng: p.location.longitude };
      return {
        id: p.id,
        ...pos,
        label: p.displayName?.text || "Bus stop",
        dist: haversine(center, pos),
      };
    })
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 12);
}
