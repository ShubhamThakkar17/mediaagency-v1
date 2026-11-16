import { K, A, P, POP, TINT, Svg } from './base';

/** Print: a newspaper unfolds; headline lines type in. */
export function PrintGlyph() {
  return (
    <Svg id="print">
      <g className="g-print-paper">
        <rect x="14" y="20" width="46" height="80" rx="5" fill={P} />
        <path d="M23 33H51" strokeWidth="7" />
        <rect x="22" y="44" width="30" height="24" rx="3" fill={POP} stroke="none" />
        <circle cx="31" cy="53" r="4" fill={P} stroke="none" />
        <path d="M22 68L33 57L40 63L45 59L52 66V68Z" fill={K} stroke="none" />
        <path className="g-print-t7 g-o-l" d="M23 79H51" strokeWidth="3.5" />
        <path className="g-print-t8 g-o-l" d="M23 89H43" strokeWidth="3.5" />
        <g className="g-print-flap g-o-l">
          <rect x="60" y="20" width="46" height="80" rx="5" fill={P} />
          <path className="g-print-t1 g-o-l" d="M69 33H97" strokeWidth="5.5" />
          <path className="g-print-t2 g-o-l" d="M69 45H89" strokeWidth="5.5" />
          <path className="g-print-t3 g-o-l" d="M69 59H97" strokeWidth="3.5" stroke={POP} />
          <path className="g-print-t4 g-o-l" d="M69 69H97" strokeWidth="3.5" />
          <path className="g-print-t5 g-o-l" d="M69 79H97" strokeWidth="3.5" />
          <path className="g-print-t6 g-o-l" d="M69 89H85" strokeWidth="3.5" />
        </g>
      </g>
    </Svg>
  );
}

/** TV: an old CRT with scanlines; the channel changes; a LIVE dot blinks. */
export function TvGlyph() {
  const scan = [];
  for (let y = -32; y <= 44; y += 8) scan.push(`M-2 ${y + 4}H60`);
  return (
    <Svg id="tv">
      <path d="M60 30L42 10M60 30L80 12" />
      <rect x="10" y="30" width="100" height="68" rx="12" fill={P} />
      <path d="M30 98V107M90 98V107" />
      <rect x="19" y="39" width="62" height="50" rx="8" fill={K} />
      <svg x="21" y="41" width="58" height="46">
        <g className="g-tv-squash g-o-c">
          <rect width="58" height="46" fill={POP} stroke="none" />
          <g stroke="none">
            <rect x="7" y="8" width="9" height="30" rx="2" fill={P} />
            <rect x="19" y="8" width="9" height="30" rx="2" fill={K} />
            <rect x="31" y="8" width="9" height="30" rx="2" fill={TINT} />
            <rect x="43" y="8" width="9" height="30" rx="2" fill={P} />
          </g>
          <g className="g-tv-a" stroke="none">
            <rect width="58" height="46" fill={TINT} />
            <circle cx="42" cy="15" r="7.5" fill={POP} />
            <path d="M0 46L17 22L30 37L39 29L58 46Z" fill={K} />
          </g>
        </g>
        <path className="g-tv-scan" d={scan.join('')} strokeWidth="2" opacity="0.2" />
      </svg>
      <rect x="19" y="39" width="62" height="50" rx="8" />
      <circle cx="95" cy="49" r="6" fill={TINT} strokeWidth="3.5" />
      <path d="M95 49L98 46" strokeWidth="3" />
      <circle cx="95" cy="67" r="6" fill={TINT} strokeWidth="3.5" />
      <circle className="g-tv-live" cx="95" cy="85" r="4.5" fill={POP} stroke="none" />
    </Svg>
  );
}

/** Radio: a transistor with sound waves pulsing outward. */
export function RadioGlyph() {
  return (
    <Svg id="radio">
      <g stroke={A}>
        <path className="g-radio-w1" d="M69.8 15.1A12 12 0 0 1 69.8 28.9M50.2 15.1A12 12 0 0 0 50.2 28.9" />
        <path className="g-radio-w2" d="M79.7 8.2A24 24 0 0 1 79.7 35.8M40.3 8.2A24 24 0 0 0 40.3 35.8" />
      </g>
      <path d="M72 50L60 23" />
      <circle cx="60" cy="22" r="3.5" fill={K} stroke="none" />
      <rect x="12" y="50" width="96" height="54" rx="11" fill={P} />
      <circle cx="39" cy="77" r="17" fill={TINT} />
      <circle className="g-radio-cone g-o-c" cx="39" cy="77" r="7" fill={POP} stroke="none" />
      <rect x="66" y="61" width="33" height="12" rx="4" fill={TINT} strokeWidth="3.5" />
      <path className="g-radio-needle" d="M82 62V72" strokeWidth="3" stroke={POP} />
      <circle cx="73" cy="89" r="5.5" fill={K} stroke="none" />
      <circle cx="92" cy="89" r="5.5" fill={POP} stroke="none" />
    </Svg>
  );
}

function Reel({ cx, cy, r, cls }: { cx: number; cy: number; r: number; cls: string }) {
  const holes = [0, 1, 2].map((i) => {
    const a = (i * 120 - 90) * (Math.PI / 180);
    return [cx + Math.cos(a) * r * 0.54, cy + Math.sin(a) * r * 0.54] as const;
  });
  return (
    <g className={`${cls} g-o-c`}>
      <circle cx={cx} cy={cy} r={r} fill={P} />
      {holes.map(([x, y], i) => (
        <circle key={i} cx={x.toFixed(2)} cy={y.toFixed(2)} r={(r * 0.24).toFixed(2)} fill={K} stroke="none" />
      ))}
      <circle cx={cx} cy={cy} r="2.2" fill={POP} stroke="none" />
    </g>
  );
}

/** Cinema: a film reel spins; a projector beam flickers. */
export function CinemaGlyph() {
  return (
    <Svg id="cinema">
      <path className="g-cinema-beam" d="M38 77L5 56V100Z" fill={A} stroke={A} strokeWidth="3" />
      <path d="M64 93L54 111M86 93L96 111" />
      <path d="M62 20L93 30" strokeWidth="3" />
      <Reel cx={62} cy={38} r={18} cls="g-cinema-reel1" />
      <Reel cx={93} cy={43} r={13} cls="g-cinema-reel2" />
      <rect x="46" y="58" width="58" height="35" rx="7" fill={P} />
      <rect x="35" y="67" width="11" height="20" rx="2.5" fill={K} />
      <circle cx="62" cy="76" r="6" fill={POP} stroke="none" />
      <path d="M77 71H94M77 80H94" strokeWidth="3.2" />
    </Svg>
  );
}
