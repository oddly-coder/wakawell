import { fmtDist } from "../lib/format";

const SEARCHES = [
  ["me", "Near me"],
  ["start", "Near start"],
  ["destination", "Near destination"],
];

export default function BusStopsPanel({
  stops,
  note,
  loading,
  activeStop,
  onFind,
  onSelect,
  onDeselect,
  onWalk,
  onRide,
}) {
  return (
    <section className="border-t border-slate-200 p-4">
      <h2 className="mb-2 text-sm font-semibold text-slate-900">Find bus stops</h2>

      <div className="flex flex-wrap gap-2">
        {SEARCHES.map(([where, label]) => (
          <button
            key={where}
            onClick={() => onFind(where)}
            disabled={loading}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <p className="mt-3 text-sm text-slate-500">Looking for stops…</p>}
      {note && !loading && <p className="mt-3 text-sm text-slate-600">{note}</p>}

      {stops.length > 0 && (
        <ul className="mt-3 divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
          {stops.map((s) => {
            const open = activeStop?.id === s.id;
            return (
              <li key={s.id} className={open ? "bg-blue-50" : ""}>
                <button
                  onClick={() => (open ? onDeselect() : onSelect(s))}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left"
                >
                  <span className="text-sm text-slate-800">{s.label}</span>
                  <span className="text-xs text-slate-500">{fmtDist(s.dist)}</span>
                </button>
                {open && (
                  <div className="flex flex-wrap gap-2 px-3 pb-3">
                    <button
                      onClick={() => onWalk(s)}
                      className="rounded-md bg-blue-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-800"
                    >
                      Walk to this stop
                    </button>
                    <button
                      onClick={() => onRide(s)}
                      className="rounded-md border border-blue-700 bg-white px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50"
                    >
                      Bus from here
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
