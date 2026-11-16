import 'server-only';
import india from '@svg-maps/india';

export type MapState = { id: string; name: string; d: string };

let cache: MapState[] | null = null;

/** @svg-maps/india (CC BY 4.0) with coordinates rounded to 1 decimal to keep the payload small. */
export function getIndiaStates(): MapState[] {
  if (cache) return cache;
  const data = india as unknown as { locations: { id: string; name: string; path: string }[] };
  cache = data.locations.map((l) => ({ id: l.id, name: l.name, d: l.path.replace(/-?\d+\.\d+/g, (n) => String(Math.round(parseFloat(n) * 10) / 10)) }));
  return cache;
}
