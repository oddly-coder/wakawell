import { fmtDist, fmtTime } from "../lib/format";

export default function RouteOptions({ routes, routeIdx, onSelect }) {
  if (routes.length < 2) return null;
  return (
    <div className="mb-3 flex flex-wrap gap-2">
      {routes.map((r, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          aria-pressed={i === routeIdx}
          className={`rounded-md border px-3 py-1.5 text-left text-sm ${
            i === routeIdx
              ? "border-blue-700 bg-blue-50 text-slate-900"
              : "border-slate-300 bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <div className="font-medium">{i === 0 ? "Fastest" : `Option ${i + 1}`}</div>
          <div className="text-xs">
            {fmtTime(r.duration)} · {fmtDist(r.distance)}
          </div>
        </button>
      ))}
    </div>
  );
}
