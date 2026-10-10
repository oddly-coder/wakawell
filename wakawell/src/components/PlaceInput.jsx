import { useEffect, useRef, useState } from "react";
import { autocomplete, placeDetails } from "../lib/places";

export default function PlaceInput({ label, place, onPick, onClear }) {
  const [text, setText] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const skipNext = useRef(false);
  const sessionToken = useRef(crypto.randomUUID());

  // Keep the box in sync when a point is set from the map or a bus stop
  useEffect(() => {
    skipNext.current = true;
    setText(place?.label ?? "");
  }, [place]);

  // Debounced autocomplete
  useEffect(() => {
    if (skipNext.current) {
      skipNext.current = false;
      return;
    }
    if (text.trim().length < 3) {
      setResults([]);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        setError("");
        setResults(await autocomplete(text, sessionToken.current, ctrl.signal));
        setOpen(true);
      } catch (e) {
        if (e.name === "AbortError") return;
        setResults([]);
        setError(e.message);
      }
    }, 300);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [text]);

  async function pick(r) {
    setOpen(false);
    setResults([]);
    try {
      const p = await placeDetails(r.id, sessionToken.current);
      sessionToken.current = crypto.randomUUID(); // a new session starts after each pick
      onPick({ lat: p.lat, lng: p.lng, label: r.label });
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="relative">
      <label className="mb-1 block text-sm font-medium text-slate-600">{label}</label>
      <div className="flex items-center rounded-md border border-slate-300 bg-white focus-within:border-blue-700 focus-within:ring-2 focus-within:ring-blue-700/20">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          placeholder="Search or tap the map"
          className="w-full rounded-md bg-transparent px-3 py-2 text-sm text-slate-900 outline-none"
        />
        {place && (
          <button
            onClick={onClear}
            aria-label={`Clear ${label.toLowerCase()}`}
            className="px-3 text-slate-400 hover:text-slate-700"
          >
            ✕
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-200 bg-white shadow-lg">
          {results.map((r) => (
            <li key={r.id}>
              <button
                className="w-full px-3 py-2 text-left text-sm text-slate-800 hover:bg-blue-50"
                onClick={() => pick(r)}
              >
                {r.full}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
