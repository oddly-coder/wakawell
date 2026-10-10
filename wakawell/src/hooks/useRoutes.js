import { useEffect, useState } from "react";
import { fetchRoutes } from "../lib/routing";

/** Fetches routes whenever start, destination or travel mode change. */
export function useRoutes(from, to, mode) {
  const [routes, setRoutes] = useState([]);
  const [routeIdx, setRouteIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!from || !to) {
      setRoutes([]);
      setError("");
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    setError("");
    fetchRoutes(mode, from, to, ctrl.signal)
      .then((found) => {
        setRoutes(found);
        setRouteIdx(0);
      })
      .catch((e) => {
        if (e.name === "AbortError") return;
        setRoutes([]);
        setError(e.message || "Routing failed. Check your connection and try again.");
      })
      .finally(() => !ctrl.signal.aborted && setLoading(false));
    return () => ctrl.abort();
  }, [from, to, mode]);

  return { routes, route: routes[routeIdx], routeIdx, setRouteIdx, loading, error };
}
