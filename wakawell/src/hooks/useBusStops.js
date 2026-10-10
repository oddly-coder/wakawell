import { useState } from "react";
import { fetchStops, fetchLines } from "../lib/overpass";
import { getPosition } from "../lib/geo";
import { fmtDist } from "../lib/format";
import { STOP_RADIUS_M } from "../config";

/**
 * Finds bus stops near the user, the start or the destination, and loads the
 * bus lines for whichever stop is selected.
 * onLocated(point) is called when "near me" finds the user's position.
 */
export function useBusStops({ from, to, onLocated }) {
  const [stops, setStops] = useState([]);
  const [center, setCenter] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeStop, setActiveStop] = useState(null);
  const [lines, setLines] = useState(null); // null = loading, [] = none found

  async function find(where) {
    setLoading(true);
    setNote("");
    setActiveStop(null);
    setLines(null);
    try {
      let point;
      if (where === "me") {
        point = await getPosition();
        onLocated?.({ ...point, label: "My location" });
      } else {
        point = where === "start" ? from : to;
        if (!point) throw new Error(`Set a ${where} first.`);
      }
      const found = await fetchStops(point);
      setCenter(point);
      setStops(found);
      if (!found.length) setNote(`No bus stops mapped within ${fmtDist(STOP_RADIUS_M)}.`);
    } catch (e) {
      setStops([]);
      setNote(e.message || "Couldn't load bus stops.");
    } finally {
      setLoading(false);
    }
  }

  async function select(stop) {
    setActiveStop(stop);
    setLines(null);
    try {
      setLines(await fetchLines(stop.id));
    } catch {
      setLines([]);
    }
  }

  return {
    stops,
    center,
    note,
    loading,
    activeStop,
    lines,
    find,
    select,
    deselect: () => setActiveStop(null),
  };
}
