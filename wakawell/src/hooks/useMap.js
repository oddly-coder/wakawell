import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { MAP_STYLE, ROUTE_COLOR, EMPTY_FEATURES } from "../config";

function addRouteLayers(map) {
  map.addSource("alts", { type: "geojson", data: EMPTY_FEATURES });
  map.addLayer({
    id: "alts-line",
    type: "line",
    source: "alts",
    layout: { "line-cap": "round", "line-join": "round" },
    paint: { "line-color": "#94a3b8", "line-width": 5, "line-opacity": 0.9 },
  });
  map.addSource("route", { type: "geojson", data: EMPTY_FEATURES });
  map.addLayer({
    id: "route-casing",
    type: "line",
    source: "route",
    layout: { "line-cap": "round", "line-join": "round" },
    paint: { "line-color": "#ffffff", "line-width": 9 },
  });
  map.addLayer({
    id: "route-line",
    type: "line",
    source: "route",
    layout: { "line-cap": "round", "line-join": "round" },
    paint: { "line-color": ROUTE_COLOR, "line-width": 5 },
  });
}

/**
 * Creates the MapLibre map once and reports when it is ready.
 * onClickRef is a ref holding a function that receives { lng, lat }.
 */
export function useMap(containerRef, onClickRef) {
  const mapRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [0, 20],
      zoom: 1.5,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      "top-right"
    );

    map.on("load", () => {
      addRouteLayers(map);
      mapRef.current = map;
      setReady(true);
      // Start near the user if they allow it
      navigator.geolocation?.getCurrentPosition(
        (p) => map.jumpTo({ center: [p.coords.longitude, p.coords.latitude], zoom: 14 }),
        () => {}
      );
    });

    map.on("click", (e) => onClickRef.current?.({ lng: e.lngLat.lng, lat: e.lngLat.lat }));

    return () => {
      setReady(false);
      mapRef.current = null;
      map.remove();
    };
  }, [containerRef, onClickRef]);

  return { mapRef, ready };
}
