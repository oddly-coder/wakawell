import { useState } from "react";
import MapView from "./components/MapView";
import PlaceInput from "./components/PlaceInput";
import ModeTabs from "./components/ModeTabs";
import BusStopsPanel from "./components/BusStopsPanel";
import RouteResult from "./components/RouteResult";
import { useRoutes } from "./hooks/useRoutes";
import { useBusStops } from "./hooks/useBusStops";

export default function App() {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [mode, setMode] = useState("TRANSIT");

  const { routes, route, routeIdx, setRouteIdx, loading, error } = useRoutes(from, to, mode);
  const bus = useBusStops({ from, to, onLocated: setFrom });

  // Tap the map: first tap sets the start, later taps set the destination
  function handleMapClick(point) {
    const pin = { ...point, label: "Dropped pin" };
    if (!from) setFrom(pin);
    else setTo(pin);
  }

  function walkToStop(stop) {
    setTo({ lng: stop.lng, lat: stop.lat, label: stop.label });
    setMode("WALK");
  }

  // Use a stop as the start, then Google shows which buses go to your destination
  function rideFromStop(stop) {
    setFrom({ lng: stop.lng, lat: stop.lat, label: stop.label });
    setMode("TRANSIT");
  }

  function swap() {
    setFrom(to);
    setTo(from);
  }

  return (
    <div className="flex h-screen w-screen flex-col-reverse bg-slate-50 md:flex-row">
      <aside className="z-10 flex max-h-[55vh] w-full flex-col overflow-y-auto border-t border-slate-200 bg-slate-50 md:max-h-none md:w-96 md:border-r md:border-t-0">
        <div className="space-y-3 p-4">
          <h1 className="text-lg font-semibold text-slate-900">Plan a route</h1>
          <PlaceInput label="From" place={from} onPick={setFrom} onClear={() => setFrom(null)} />
          <PlaceInput label="To" place={to} onPick={setTo} onClear={() => setTo(null)} />
          <div className="flex items-center gap-2">
            <ModeTabs mode={mode} onChange={setMode} />
            <button
              onClick={swap}
              disabled={!from && !to}
              aria-label="Swap start and destination"
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-40"
            >
              Swap
            </button>
          </div>
        </div>

        <BusStopsPanel
          stops={bus.stops}
          note={bus.note}
          loading={bus.loading}
          activeStop={bus.activeStop}
          onFind={bus.find}
          onSelect={bus.select}
          onDeselect={bus.deselect}
          onWalk={walkToStop}
          onRide={rideFromStop}
        />

        <RouteResult
          from={from}
          to={to}
          routes={routes}
          route={route}
          routeIdx={routeIdx}
          onSelectRoute={setRouteIdx}
          loading={loading}
          error={error}
        />
      </aside>

      <main className="relative min-h-0 flex-1">
        <MapView
          from={from}
          to={to}
          routes={routes}
          routeIdx={routeIdx}
          stops={bus.stops}
          stopsCenter={bus.center}
          activeStop={bus.activeStop}
          onMapClick={handleMapClick}
          onStopClick={bus.select}
        />
      </main>
    </div>
  );
}
