import { useEffect } from "react";
import { Map, AdvancedMarker, Pin, useMap } from "@vis.gl/react-google-maps";
import { GOOGLE_MAP_ID, ROUTE_COLOR } from "../config";

// Zoom the map to fit a list of { lat, lng } points
function fit(map, points) {
  const bounds = new google.maps.LatLngBounds();
  points.forEach((p) => bounds.extend(p));
  map.fitBounds(bounds, 60);
  // A single nearby point would otherwise zoom in absurdly far
  google.maps.event.addListenerOnce(map, "idle", () => {
    if (map.getZoom() > 17) map.setZoom(17);
  });
}

// Start the map near the user if they allow it
function LocateOnLoad() {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    navigator.geolocation?.getCurrentPosition(
      (p) => {
        map.setCenter({ lat: p.coords.latitude, lng: p.coords.longitude });
        map.setZoom(14);
      },
      () => {}
    );
  }, [map]);
  return null;
}

// The chosen route in blue, alternatives in grey
function RouteLayer({ routes, routeIdx }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const lines = routes.map(
      (r, i) =>
        new google.maps.Polyline({
          map,
          path: r.path,
          strokeColor: i === routeIdx ? ROUTE_COLOR : "#94a3b8",
          strokeWeight: i === routeIdx ? 6 : 5,
          strokeOpacity: 0.95,
          zIndex: i === routeIdx ? 2 : 1,
        })
    );
    return () => lines.forEach((l) => l.setMap(null));
  }, [map, routes, routeIdx]);

  // Zoom to a new set of routes (not when switching between options)
  useEffect(() => {
    if (map && routes.length) fit(map, routes[0].path);
  }, [map, routes]);

  return null;
}

function StopsLayer({ stops, center, activeStop, onStopClick }) {
  const map = useMap();

  useEffect(() => {
    if (map && stops.length && center) fit(map, [center, ...stops]);
  }, [map, stops, center]);

  return (
    <>
      {stops.map((s) => {
        const active = activeStop?.id === s.id;
        return (
          <AdvancedMarker
            key={s.id}
            position={{ lat: s.lat, lng: s.lng }}
            title={s.label}
            onClick={() => onStopClick(s)}
          >
            <div
              className={`h-5 w-5 rounded-full border-2 border-white shadow ${
                active ? "bg-blue-700 ring-4 ring-blue-700/30" : "bg-amber-500"
              }`}
            />
          </AdvancedMarker>
        );
      })}
    </>
  );
}

/**
 * Renders the Google map and keeps it in sync with the app state: start and
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
  return (
    <div className="absolute inset-0">
      <Map
        mapId={GOOGLE_MAP_ID}
        defaultCenter={{ lat: 20, lng: 0 }}
        defaultZoom={2}
        gestureHandling="greedy"
        clickableIcons={false}
        onClick={(e) => {
          const p = e.detail.latLng;
          if (p) onMapClick({ lat: p.lat, lng: p.lng });
        }}
      >
        <LocateOnLoad />
        <RouteLayer routes={routes} routeIdx={routeIdx} />
        <StopsLayer
          stops={stops}
          center={stopsCenter}
          activeStop={activeStop}
          onStopClick={onStopClick}
        />
        {from && (
          <AdvancedMarker position={{ lat: from.lat, lng: from.lng }}>
            <Pin background="#0f172a" borderColor="#ffffff" glyphColor="#ffffff" />
          </AdvancedMarker>
        )}
        {to && (
          <AdvancedMarker position={{ lat: to.lat, lng: to.lng }}>
            <Pin background={ROUTE_COLOR} borderColor="#ffffff" glyphColor="#ffffff" />
          </AdvancedMarker>
        )}
      </Map>
    </div>
  );
}
