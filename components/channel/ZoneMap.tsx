import { stateById, type ZoneId } from '@/data/regions';
import { INDIA_VIEWBOX } from '@/lib/geo';

/** Static mini-map shading each state by the channel's strength in its zone. */
export function ZoneMap({ states, strength, label }: { states: { id: string; d: string }[]; strength: Record<ZoneId, number>; label: string }) {
  const fill = (v: number) => `color-mix(in srgb, var(--brand) ${Math.round(12 + (v - 1) * 22)}%, var(--cream))`;
  return (
    <svg viewBox={`0 0 ${INDIA_VIEWBOX.width} ${INDIA_VIEWBOX.height}`} className="h-auto w-full" role="img" aria-label={label}>
      {states.map((s) => {
        const z = stateById(s.id)?.zone;
        return <path key={s.id} d={s.d} fill={z ? fill(strength[z]) : 'var(--cream)'} stroke="var(--paper)" strokeWidth={1.2} />;
      })}
    </svg>
  );
}
