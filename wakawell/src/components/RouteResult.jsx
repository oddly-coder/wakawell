import { fmtDist, fmtTime } from "../lib/format";
import RouteOptions from "./RouteOptions";
import RouteSteps from "./RouteSteps";

export default function RouteResult({
  from,
  to,
  routes,
  route,
  routeIdx,
  onSelectRoute,
  loading,
  error,
}) {
  return (
    <div className="flex-1 border-t border-slate-200 p-4">
      {!from && !to && (
        <p className="text-sm text-slate-500">
          Search for a place, or tap the map to set your start and then your destination.
        </p>
      )}
      {from && !to && <p className="text-sm text-slate-500">Now choose a destination.</p>}
      {loading && <p className="text-sm text-slate-500">Finding the best route…</p>}
      {error && (
        <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {route && !loading && (
        <>
          <RouteOptions routes={routes} routeIdx={routeIdx} onSelect={onSelectRoute} />
          <div className="mb-4 flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-slate-900">{fmtTime(route.duration)}</span>
            <span className="text-sm text-slate-600">{fmtDist(route.distance)}</span>
          </div>
          <RouteSteps route={route} />
        </>
      )}
    </div>
  );
}
