import { fmtDist } from "../lib/format";

export default function RouteSteps({ route }) {
  return (
    <ol className="divide-y divide-slate-200">
      {route.steps.map((s, i) => (
        <li key={i} className="flex items-start gap-3 py-2.5">
          <span className="mt-0.5 w-6 text-center text-lg leading-none text-blue-700" aria-hidden>
            {s.icon}
          </span>
          <div className="flex-1">
            <div className="text-sm text-slate-800">{s.text}</div>
            {s.detail && <div className="mt-0.5 text-xs text-slate-500">{s.detail}</div>}
          </div>
          {s.distance > 0 && <span className="text-xs text-slate-500">{fmtDist(s.distance)}</span>}
        </li>
      ))}
    </ol>
  );
}
