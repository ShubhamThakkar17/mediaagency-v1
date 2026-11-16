import { K, A, P, S, POP, TINT, Svg } from './base';

/** Data chart: bars rise, a trend line draws. */
export function DataChartGlyph() {
  const bars = [
    { x: 21, h: 28 },
    { x: 43, h: 44 },
    { x: 65, h: 36 },
    { x: 87, h: 62 },
  ];
  const dots: [number, number][] = [
    [29, 64],
    [51, 47],
    [73, 55],
  ];
  return (
    <Svg id="data-chart">
      <path d="M16 34H108M16 58H108M16 82H108" stroke={S} strokeWidth="2.5" />
      {bars.map((b, i) => (
        <rect
          key={i}
          className="g-data-chart-bar g-o-b"
          style={{ animationDelay: `${i * 0.12}s` }}
          x={b.x}
          y={104 - b.h}
          width="16"
          height={b.h}
          rx="3"
          fill={i === 3 ? A : P}
        />
      ))}
      <path d="M14 10V104H110" strokeWidth="5" />
      <path className="g-data-chart-trend" d="M29 64L51 47L73 55L101 19" pathLength={100} strokeDasharray="100 100" strokeWidth="4.5" />
      <path className="g-data-chart-head" d="M90 18.5H101.5V30" strokeWidth="4.5" />
      {dots.map(([x, y], i) => (
        <circle
          key={i}
          className="g-data-chart-dot g-o-c"
          style={{ animationDelay: `${i * 0.25}s` }}
          cx={x}
          cy={y}
          r="4.6"
          fill={P}
          strokeWidth="3.5"
        />
      ))}
    </Svg>
  );
}

const INDIA =
  'M29.3 11.2L34.6 7.5L42.1 7.8L46.3 14.9L48.1 19.7L54.1 27.1L64.8 37.1L79.4 40.8L80.4 36L84.7 40L93.2 39.7L102.1 36.3L108.1 31.2L111.7 35.6L106 40L102.4 46.7L99.6 50.4L97.8 55.6L95.3 52.6L93.6 49.3L91.8 46.3L85.7 45.6L81.5 42.6L79.4 46.3L82.2 52.3L82.2 58.5L75.8 60L73.3 65.2L67.6 68.9L58.8 77.4L51.7 81.5L51.3 90L49.9 100.4L44.9 106.3L41.7 109.2L38.5 106.3L35.7 97.8L32.1 91.5L28.9 82.2L26.5 74.8L25 68.5L25.4 62.2L24 57.8L19.4 62.2L16.2 61.5L11.6 56.7L11.2 54.8L15.5 55.2L13.7 53L9.1 51.9L12.3 48.9L17.2 44.5L15.5 39.7L20.8 33.4L26.8 28.6L31.4 24.1L32.8 19.7L30.4 16Z';
const BIG_PIN = 'M0 0C-13 -14 -15 -21 -15 -27A15 15 0 1 1 15 -27C15 -21 13 -14 0 0Z';

/** India pin: a pin drops onto the map; a ring pulses. */
export function IndiaPinGlyph() {
  const cities: [number, number][] = [
    [33, 30],
    [88, 50],
    [30, 80],
    [70, 46],
  ];
  return (
    <Svg id="india-pin">
      <path d={INDIA} fill={S} strokeWidth="3.5" />
      {cities.map(([x, y], i) => (
        <circle
          key={i}
          className="g-india-pin-city g-o-c"
          style={{ animationDelay: `${i * 0.35}s` }}
          cx={x}
          cy={y}
          r="2.8"
          fill={K}
          stroke="none"
        />
      ))}
      <ellipse className="g-india-pin-r2 g-o-c" cx="47" cy="61" rx="15" ry="5.5" stroke={A} strokeWidth="3.5" />
      <ellipse className="g-india-pin-r1 g-o-c" cx="47" cy="61" rx="15" ry="5.5" stroke={A} strokeWidth="3.5" />
      <g className="g-india-pin-drop g-o-b">
        <path d={BIG_PIN} transform="translate(47 61)" fill={A} />
        <circle cx="47" cy="34" r="5.5" fill={P} />
      </g>
    </Svg>
  );
}

function zigzag(x0: number, x1: number, y: number, teeth: number) {
  const w = (x1 - x0) / teeth;
  let d = '';
  for (let i = 0; i < teeth; i++) d += `l${(-w / 2).toFixed(2)} 5l${(-w / 2).toFixed(2)} -5`;
  return `M${x0} 14H${x1}V${y}${d}Z`;
}
const RECEIPT = zigzag(28, 92, 96, 8);

/** Receipt: a receipt prints line by line; a tick stamps on. */
export function ReceiptGlyph() {
  const rows = [42, 52, 62];
  return (
    <Svg id="receipt">
      <g className="g-receipt-paper">
        <g className="g-receipt-feed">
          <path d={RECEIPT} fill={P} />
          <path d="M44 32H76" strokeWidth="5" />
          {rows.map((y, i) => (
            <path key={y} d={`M38 ${y}H${[62, 56, 66][i]}M73 ${y}H82`} strokeWidth="3.5" />
          ))}
          <path d="M38 72H82" strokeWidth="2.5" strokeDasharray="0.1 5" />
          <path d="M38 84H56" strokeWidth="5" stroke={POP} />
          <path d="M68 84H82" strokeWidth="5" />
        </g>
      </g>
      <rect x="12" y="7" width="96" height="19" rx="7" fill={K} />
      <path d="M24 22H96" stroke={P} strokeWidth="2.5" opacity="0.35" />
      <circle className="g-receipt-led" cx="98" cy="14.5" r="2.6" fill={POP} stroke="none" />
      <circle cx="22" cy="14.5" r="2.6" fill={TINT} stroke="none" />
      <g className="g-receipt-stamp g-o-c">
        <circle cx="86" cy="90" r="15" fill={POP} strokeWidth="4" />
        <path d="M78.5 90.5L84 96L94 84.5" stroke={P} strokeWidth="4.5" />
      </g>
    </Svg>
  );
}

/** Deterministic pseudo-random static rows (same output on server and client). */
function noiseRows(seed: number) {
  let s = seed;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const fills = [P, TINT, POP, P];
  const out: { x: number; y: number; w: number; f: string }[] = [];
  for (let y = 2; y < 46; y += 6) {
    let x = -4 + rnd() * 6;
    while (x < 62) {
      const w = 4 + rnd() * 14;
      out.push({ x, y, w, f: fills[Math.floor(rnd() * fills.length)] });
      x += w + 2 + rnd() * 8;
    }
  }
  return out;
}
const NOISE_A = noiseRows(7);
const NOISE_B = noiseRows(31);

function Noise({ rows, cls }: { rows: ReturnType<typeof noiseRows>; cls: string }) {
  return (
    <g className={cls} stroke="none">
      {cls.endsWith('n2') && <rect x="-6" width="72" height="46" fill={K} />}
      {rows.map((r, i) => (
        <rect key={i} x={r.x.toFixed(1)} y={r.y} width={r.w.toFixed(1)} height="3.2" rx="1.6" fill={r.f} />
      ))}
    </g>
  );
}

/** Lost signal (404): an old CRT TV with jittering static bars. */
export function LostSignalGlyph() {
  return (
    <Svg id="lost-signal">
      <g className="g-lost-signal-ant g-o-vb">
        <path d="M60 32L43 11M60 32L73 17L87 14" />
        <circle cx="43" cy="11" r="3.4" fill={K} stroke="none" />
        <circle cx="87" cy="14" r="3.4" fill={A} stroke="none" />
      </g>
      <rect x="10" y="32" width="100" height="66" rx="12" fill={P} />
      <path d="M30 98V107M90 98V107" />
      <rect x="18" y="40" width="64" height="50" rx="8" fill={K} />
      <svg x="20" y="42" width="60" height="46">
        <Noise rows={NOISE_A} cls="g-lost-signal-n1" />
        <Noise rows={NOISE_B} cls="g-lost-signal-n2" />
        <rect className="g-lost-signal-roll" x="0" y="0" width="60" height="9" fill={P} opacity="0.3" stroke="none" />
      </svg>
      <rect x="18" y="40" width="64" height="50" rx="8" />
      <circle cx="96" cy="51" r="6" fill={TINT} strokeWidth="3.5" />
      <path d="M93 54L99 48" strokeWidth="3" />
      <circle cx="96" cy="69" r="6" fill={TINT} strokeWidth="3.5" />
      <path d="M90.5 82H101.5M90.5 88H101.5" strokeWidth="3" />
    </Svg>
  );
}
