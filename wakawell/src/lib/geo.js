const rad = (d) => (d * Math.PI) / 180;

// Straight-line distance in metres between two { lat, lng } points
export function haversine(a, b) {
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371000 * Math.asin(Math.sqrt(x));
}

// Ask the browser for the user's position as { lng, lat }
export function getPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("This browser can't share your location."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lng: p.coords.longitude, lat: p.coords.latitude }),
      () => reject(new Error("Allow location access to find stops near you.")),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}
