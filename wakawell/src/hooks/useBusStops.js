import { useState } from "react";
import { fetchStops } from "../lib/places";
import { getPosition } from "../lib/geo";
import { fmtDist } from "../lib/format";
import { STOP_RADIUS_M } from "../config";

/**
 * Finds bus stops near the user, the start or the destination.
 * onLocated(point) is called when "near me" finds the user's position.
 */
export function useBusStops({ from, to, onLocated }) {
  const [stops, setStops] = useState([]);
  const [center, setCenter] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeStop, setActiveStop] = useState(null);

  async function find(where) {
    setLoading(true);
    setNote("");
    setActiveStop(null);
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
      if (!found.length) setNote(`No bus stops found within ${fmtDist(STOP_RADIUS_M)}.`);
    } catch (e) {
      setStops([]);
      setNote(e.message || "Couldn't load bus stops.");
    } finally {
      setLoading(false);
    }
  }

  return {
    stops,
    center,
    note,
    loading,
    activeStop,
    find,
    select: setActiveStop,
    deselect: () => setActiveStop(null),
  };
}
