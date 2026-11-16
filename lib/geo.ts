/**
 * Projects latitude/longitude onto the @svg-maps/india viewBox (0 0 612 696).
 * The map is a Mercator projection; the constants below were fitted against
 * the bounding boxes of small states and UTs (Delhi, Goa, Sikkim, Chandigarh).
 */
export const INDIA_VIEWBOX = { width: 612, height: 696 };

export function projectIndia(lat: number, lng: number) {
  const x = 21.0 * (lng - 68.25);
  const y = 838.2 - 1206.2 * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
  return { x, y };
}
