/* Google Maps Platform settings. Put your key in .env (see .env.example). */
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
export const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID || "DEMO_MAP_ID";

export const ROUTES_URL = "https://routes.googleapis.com/directions/v2:computeRoutes";
export const PLACES_URL = "https://places.googleapis.com/v1";

// ids are the travel modes Google's Routes API expects
export const MODES = [
  { id: "TRANSIT", label: "Bus" },
  { id: "WALK", label: "Walk" },
  { id: "BICYCLE", label: "Cycle" },
  { id: "DRIVE", label: "Drive" },
];

export const STOP_RADIUS_M = 1000;
export const ROUTE_COLOR = "#1d4ed8";
