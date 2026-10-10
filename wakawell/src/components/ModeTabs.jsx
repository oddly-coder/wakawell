import { MODES } from "../config";

export default function ModeTabs({ mode, onChange }) {
  return (
    <div className="flex flex-1 rounded-md bg-slate-200 p-1" role="tablist">
      {MODES.map((m) => (
        <button
          key={m.id}
          role="tab"
          aria-selected={mode === m.id}
          onClick={() => onChange(m.id)}
          className={`flex-1 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
            mode === m.id
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
