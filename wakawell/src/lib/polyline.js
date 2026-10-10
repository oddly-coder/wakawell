// Decodes Google's encoded polyline string into [{ lat, lng }, ...]
export function decodePolyline(str) {
  const points = [];
  let i = 0;
  let lat = 0;
  let lng = 0;

  const next = () => {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = str.charCodeAt(i++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    return result & 1 ? ~(result >> 1) : result >> 1;
  };

  while (i < str.length) {
    lat += next();
    lng += next();
    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return points;
}
