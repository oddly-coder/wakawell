import { ROUTES_URL } from "../config";
import { googleFetch } from "./google";
import { decodePolyline } from "./polyline";

const FIELDS = [
  "routes.duration",
  "routes.distanceMeters",
  "routes.polyline.encodedPolyline",
  "routes.legs.steps.distanceMeters",
  "routes.legs.steps.travelMode",
  "routes.legs.steps.navigationInstruction",
  "routes.legs.steps.transitDetails",
].join(",");

const point = (p) => ({ location: { latLng: { latitude: p.lat, longitude: p.lng } } });

function maneuverIcon(m = "") {
  if (m.includes("UTURN")) return "↩";
  if (m.includes("ROUNDABOUT")) return "↻";
  if (m.includes("LEFT")) return "↰";
  if (m.includes("RIGHT")) return "↱";
  return "↑";
}

// Google gives one step shape for walking/driving and another for bus rides.
// We flatten both into { icon, text, detail?, distance } so the UI stays simple.
function normalizeStep(s) {
  const t = s.transitDetails;
  if (t) {
    const line = t.transitLine ?? {};
    const name = line.nameShort || line.name || "Bus";
    const from = t.stopDetails?.departureStop?.name;
    const to = t.stopDetails?.arrivalStop?.name;
    const detail = [
      from && to ? `Get on at ${from}, off at ${to}` : null,
      t.stopCount ? `${t.stopCount} stops` : null,
    ]
      .filter(Boolean)
      .join(" · ");
    return {
      icon: "🚌",
      text: `Take ${name}${t.headsign ? ` toward ${t.headsign}` : ""}`,
      detail,
      distance: s.distanceMeters ?? 0,
    };
  }
  const nav = s.navigationInstruction;
  return {
    icon: maneuverIcon(nav?.maneuver),
    text: nav?.instructions || (s.travelMode === "WALK" ? "Walk" : "Continue"),
    distance: s.distanceMeters ?? 0,
  };
}

function normalizeRoute(r) {
  const steps = (r.legs ?? []).flatMap((l) => l.steps ?? []).map(normalizeStep);
  steps.push({ icon: "●", text: "Arrive at your destination", distance: 0 });
  return {
    duration: parseInt(r.duration, 10) || 0, // Google returns "1234s"
    distance: r.distanceMeters ?? 0,
    path: decodePolyline(r.polyline.encodedPolyline),
    steps,
  };
}

// mode is one of DRIVE, WALK, BICYCLE, TRANSIT. Returns routes, fastest first.
export async function fetchRoutes(mode, from, to, signal) {
  const body = {
    origin: point(from),
    destination: point(to),
    travelMode: mode,
    computeAlternativeRoutes: true,
    units: "METRIC",
  };
  if (mode === "DRIVE") body.routingPreference = "TRAFFIC_AWARE";
  // Bus only. Remove this line to also allow trains, trams and so on.
  if (mode === "TRANSIT") body.transitPreferences = { allowedTravelModes: ["BUS"] };

  const data = await googleFetch(ROUTES_URL, { method: "POST", body, fieldMask: FIELDS, signal });
  if (!data.routes?.length) {
    throw new Error(
      mode === "TRANSIT"
        ? "No bus route found. Google may not have bus data for this area. Try Walk or Drive."
        : "No route found between these points."
    );
  }
  return data.routes.map(normalizeRoute).sort((a, b) => a.duration - b.duration);
}
