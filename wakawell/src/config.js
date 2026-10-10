/*
  Dev-only public services. Swap these for your own Valhalla/OSRM,
  Nominatim/Photon/Pelias, Overpass and tile server before production.
*/
export const ROUTERS = {
  car: "https://routing.openstreetmap.de/routed-car/route/v1/driving",
  bike: "https://routing.openstreetmap.de/routed-bike/route/v1/driving",
  foot: "https://routing.openstreetmap.de/routed-foot/route/v1/driving",
};

export const MODES = [
  { id: "car", label: "Drive" },
  { id: "bike", label: "Cycle" },
  { id: "foot", label: "Walk" },
];

export const GEOCODER = "https://nominatim.openstreetmap.org/search";
export const OVERPASS = "https://overpass-api.de/api/interpreter";
export const STOP_RADIUS_M = 1000;

export const MAP_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [{ id: "osm", type: "raster", source: "osm" }],
};

export const ROUTE_COLOR = "#1d4ed8";
export const EMPTY_FEATURES = { type: "FeatureCollection", features: [] };
