import { ROUTERS } from "../config";

// Returns routes sorted fastest first. Throws a readable error on failure.
export async function fetchRoutes(mode, from, to, signal) {
  const res = await fetch(
    `${ROUTERS[mode]}/${from.lng},${from.lat};${to.lng},${to.lat}` +
      `?overview=full&geometries=geojson&steps=true&alternatives=true`,
    { signal }
  );
  const data = await res.json();
  if (data.code !== "Ok" || !data.routes?.length) {
    throw new Error("No route found between these points.");
  }
  return [...data.routes].sort((a, b) => a.duration - b.duration);
}
