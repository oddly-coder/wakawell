import { fmtDist } from "../lib/format";
import { describe, arrow } from "../lib/instructions";

export default function RouteSteps({ route }) {
  const steps = route.legs?.flatMap((l) => l.steps) ?? [];
  return (
    <ol className="divide-y divide-slate-200">
      {steps.map((s, i) => (
        <li key={i} className="flex items-start gap-3 py-2.5">
          <span className="mt-0.5 w-6 text-center text-lg leading-none text-blue-700" aria-hidden>
            {arrow(s)}
          </span>
          <div className="flex-1 text-sm text-slate-800">{describe(s)}</div>
          {s.distance > 0 && <span className="text-xs text-slate-500">{fmtDist(s.distance)}</span>}
        </li>
      ))}
    </ol>
  );
}
