import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { useMap } from "../hooks/useMap";
import { ROUTE_COLOR, EMPTY_FEATURES } from "../config";

// Accepts { lng, lat } objects or [lng, lat] pairs
function boundsOf(points) {
  const toPair = (p) => (Array.isArray(p) ? p : [p.lng, p.lat]);
  const first = toPair(points[0]);
  return points.reduce(
    (b, p) => b.extend(toPair(p)),
    new maplibregl.LngLatBounds(first, first)
  );
}

/**
 * Renders the map and keeps it in sync with the app state: start and
 * destination pins, bus stop dots, and the chosen and alternative routes.
 */
export default function MapView({
  from,
  to,
  routes,
  routeIdx,
  stops,
  stopsCenter,
  activeStop,
  onMapClick,
  onStopClick,
}) {
  const containerRef = useRef(null);
  const clickRef = useRef(onMapClick);
  const stopClickRef = useRef(onStopClick);
  clickRef.current = onMapClick;
  stopClickRef.current = onStopClick;

  const { mapRef, ready } = useMap(containerRef, clickRef);
  const markers = useRef({ from: null, to: null, stops: [] });

  // Start and destination pins
  useEffect(() => {
    if (!ready) return;
    const sync = (key, point, color) => {
      markers.current[key]?.remove();
      markers.current[key] = point
        ? new maplibregl.Marker({ color }).setLngLat([point.lng, point.lat]).addTo(mapRef.current)
        : null;
    };
    sync("from", from, "#0f172a");
    sync("to", to, ROUTE_COLOR);
  }, [from, to, ready, mapRef]);

  // Bus stop dots
  useEffect(() => {
    if (!ready) return;
    markers.current.stops.forEach((m) => m.remove());
    markers.current.stops = stops.map((s) => {
      const el = document.createElement("button");
      const isActive = activeStop?.id === s.id;
      el.setAttribute("aria-label", `Bus stop: ${s.label}`);
      el.className = `h-5 w-5 rounded-full border-2 border-white shadow ${
        isActive ? "bg-blue-700 ring-4 ring-blue-700/30" : "bg-amber-500"
      }`;
      el.addEventListener("click", (ev) => {
        ev.stopPropagation(); // don't also drop a pin
        stopClickRef.current?.(s);
      });
      return new maplibregl.Marker({ element: el }).setLngLat([s.lng, s.lat]).addTo(mapRef.current);
    });
  }, [stops, activeStop, ready, mapRef]);

  // Zoom to the stops that were found
  useEffect(() => {
    if (!ready || !stops.length || !stopsCenter) return;
    mapRef.current.fitBounds(boundsOf([stopsCenter, ...stops]), {
      padding: 60,
      duration: 700,
      maxZoom: 17,
    });
  }, [stops, stopsCenter, ready, mapRef]);

  // Draw the chosen route, and the others in grey
  useEffect(() => {
    if (!ready) return;
    const feature = (r) => ({ type: "Feature", geometry: r.geometry, properties: {} });
    mapRef.current
      .getSource("route")
      .setData(routes[routeIdx] ? feature(routes[routeIdx]) : EMPTY_FEATURES);
    mapRef.current.getSource("alts").setData({
      type: "FeatureCollection",
      features: routes.filter((_, i) => i !== routeIdx).map(feature),
    });
  }, [routes, routeIdx, ready, mapRef]);

  // Zoom to a new set of routes (not when switching between options)
  useEffect(() => {
    if (!ready || !routes.length) return;
    mapRef.current.fitBounds(boundsOf(routes[0].geometry.coordinates), {
      padding: 60,
      duration: 700,
    });
  }, [routes, ready, mapRef]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
