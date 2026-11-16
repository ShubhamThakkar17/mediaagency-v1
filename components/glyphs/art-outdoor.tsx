import { K, A, P, S, POP, TINT, Svg } from './base';

function PosterA() {
  return (
    <g stroke="none">
      <rect width="90" height="46" fill={POP} />
      <circle cx="23" cy="23" r="13" fill={P} />
      <rect x="44" y="9" width="36" height="8" rx="4" fill={K} />
      <rect x="44" y="22" width="26" height="6" rx="3" fill={P} />
      <rect x="44" y="32" width="18" height="6" rx="3" fill={P} />
    </g>
  );
}
function PosterB() {
  return (
    <g stroke="none">
      <rect width="90" height="46" fill={TINT} />
      <path d="M48 46L70 0H90V46Z" fill={POP} />
      <circle cx="68" cy="23" r="12" fill={K} />
      <rect x="9" y="10" width="32" height="8" rx="4" fill={K} />
      <rect x="9" y="24" width="22" height="6" rx="3" fill={POP} />
    </g>
  );
}

/** Hoardings: a billboard on a pole; the poster flips panel by panel (trivision). */
export function HoardingsGlyph() {
  const panels = [0, 1, 2, 3, 4];
  return (
    <Svg id="hoardings">
      <path d="M30 13V7M60 13V7M90 13V7" strokeWidth="3.5" />
      <path d="M60 70V104" strokeWidth="8" />
      <path d="M44 84L60 72L76 84" strokeWidth="3.5" />
      <path d="M36 107H84" />
      <rect x="10" y="14" width="100" height="56" rx="6" fill={K} />
      {panels.map((i) => {
        const style = { transformOrigin: `${24 + i * 18}px 42px`, animationDelay: `${i * 0.14}s` };
        return (
          <g key={i}>
            <g className="g-hoardings-b g-o-vb" style={style}>
              <svg x={15 + i * 18} y="19" width="18" height="46">
                <g transform={`translate(${-i * 18} 0)`}>
                  <PosterB />
                </g>
              </svg>
            </g>
            <g className="g-hoardings-a g-o-vb" style={style}>
              <svg x={15 + i * 18} y="19" width="18" height="46">
                <g transform={`translate(${-i * 18} 0)`}>
                  <PosterA />
                </g>
              </svg>
            </g>
          </g>
        );
      })}
      <path d="M33 19V65M51 19V65M69 19V65M87 19V65" strokeWidth="1.4" opacity="0.55" />
    </Svg>
  );
}

function DoohFrame({ n, x }: { n: 1 | 2 | 3; x: number }) {
  return (
    <g transform={`translate(${x} 0)`} stroke="none">
      {n === 1 && (
        <>
          <rect width="40" height="68" fill={POP} />
          <circle cx="20" cy="24" r="12" fill={P} />
          <rect x="7" y="44" width="26" height="7" rx="3.5" fill={K} />
          <rect x="7" y="55" width="17" height="5" rx="2.5" fill={P} />
        </>
      )}
      {n === 2 && (
        <>
          <rect width="40" height="68" fill={TINT} />
          <path d="M20 9L33 37H7Z" fill={K} stroke={K} strokeWidth="3" />
          <rect x="7" y="46" width="26" height="7" rx="3.5" fill={POP} />
          <rect x="7" y="57" width="17" height="5" rx="2.5" fill={K} />
        </>
      )}
      {n === 3 && (
        <>
          <rect width="40" height="68" fill={K} />
          <rect x="7" y="9" width="26" height="7" rx="3.5" fill={P} />
          <rect x="7" y="20" width="17" height="5" rx="2.5" fill={P} />
          <circle cx="22" cy="45" r="12" fill={POP} />
        </>
      )}
    </g>
  );
}

/** DOOH: a portrait screen cycling 3 ad frames with a slide transition. */
export function DoohGlyph() {
  return (
    <Svg id="dooh">
      <g className="g-dooh-rays" stroke={A} strokeWidth="4">
        <path d="M24 26L15 21M22 44H12M24 62L15 67M96 26L105 21M98 44H108M96 62L105 67" />
      </g>
      <path d="M60 98V107" strokeWidth="8" />
      <path d="M40 109H80" />
      <rect x="33" y="7" width="54" height="92" rx="9" fill={P} />
      <rect x="39" y="13" width="42" height="70" rx="3" fill={K} />
      <svg x="40" y="14" width="40" height="68">
        <g className="g-dooh-strip">
          <DoohFrame n={1} x={0} />
          <DoohFrame n={2} x={40} />
          <DoohFrame n={3} x={80} />
          <DoohFrame n={1} x={120} />
        </g>
      </svg>
      <g stroke="none">
        <circle cx="51" cy="91" r="2.6" fill={K} opacity="0.25" />
        <circle cx="60" cy="91" r="2.6" fill={K} opacity="0.25" />
        <circle cx="69" cy="91" r="2.6" fill={K} opacity="0.25" />
        <circle className="g-dooh-d1" cx="51" cy="91" r="2.6" fill={POP} />
        <circle className="g-dooh-d2" cx="60" cy="91" r="2.6" fill={POP} />
        <circle className="g-dooh-d3" cx="69" cy="91" r="2.6" fill={POP} />
      </g>
    </Svg>
  );
}

function Wheel({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <g className="g-bus-auto-wheel g-o-c">
        <circle r="10" fill={K} />
        <path d="M-5.5 0H5.5M0 -5.5V5.5" stroke={P} strokeWidth="2.8" />
      </g>
    </g>
  );
}

/** Bus/BRTS/Auto: an auto-rickshaw drives across with its branded canopy; wheels spin. */
export function BusAutoGlyph() {
  return (
    <Svg id="bus-auto">
      <path d="M4 103H116" strokeWidth="3.5" />
      <path className="g-bus-auto-road" d="M-24 112H144" strokeWidth="3" strokeDasharray="10 14" stroke={A} />
      <g className="g-bus-auto-drive">
        <g className="g-bus-auto-bob">
          <path d="M20 62V45Q20 28 37 28H66Q76 28 81 37L95 62Z" fill={A} />
          <path d="M62 38H67Q71 38 73.5 42L83 59H62Z" fill={P} strokeWidth="3.5" />
          <rect x="27" y="37" width="28" height="17" rx="4" fill={P} strokeWidth="3.5" />
          <circle cx="34.5" cy="45.5" r="3.4" fill={POP} stroke="none" />
          <path d="M42 43H50M42 48.5H47" strokeWidth="2.6" />
          <path d="M18 62H97Q107 62 107 72V85Q107 89 103 89H18Q14 89 14 85V66Q14 62 18 62Z" fill={P} />
          <path d="M22 75.5H98" stroke={POP} strokeWidth="4.5" />
          <circle cx="103" cy="71" r="3" fill={K} stroke="none" />
        </g>
        <Wheel cx={36} cy={92} />
        <Wheel cx={88} cy={92} />
      </g>
    </Svg>
  );
}

const TRAIN = 'M-34 38H84Q96 38 102 48L110 62V78Q110 84 104 84H-34Z';

/** Metro wraps: a metro train glides along a track; the wrap colour sweeps on. */
export function MetroWrapGlyph() {
  return (
    <Svg id="metro-wrap">
      <path d="M-4 19H124" strokeWidth="3" stroke={S} />
      <path d="M30 96V116M90 96V116" strokeWidth="8" />
      <path d="M-4 95H124" strokeWidth="5.5" />
      <g className="g-metro-wrap-train">
        <path d="M34 38L44 21L54 38M39 21H49" strokeWidth="3.5" />
        <rect x="14" y="84" width="24" height="7" rx="2" fill={K} stroke="none" />
        <rect x="70" y="84" width="24" height="7" rx="2" fill={K} stroke="none" />
        <path d={TRAIN} fill={P} />
        <g className="g-metro-wrap-wrap" stroke="none">
          <path d={TRAIN} fill={A} />
          <rect x="-2" y="68" width="54" height="7" rx="3.5" fill={K} />
          <circle cx="63" cy="71.5" r="5" fill={K} />
          <path d="M76 84L86 64H96L86 84Z" fill={K} />
        </g>
        <path d={TRAIN} />
        <g fill={TINT} strokeWidth="3.5">
          <rect x="2" y="46" width="20" height="15" rx="3.5" />
          <rect x="28" y="46" width="20" height="15" rx="3.5" />
          <rect x="54" y="46" width="20" height="15" rx="3.5" />
          <path d="M81 46H86Q91 46 93.5 50.5L99 61H81Z" />
        </g>
      </g>
    </Svg>
  );
}

/** Inside metro: a platform with a row of panel lightboxes lighting up in sequence. */
export function InsideMetroGlyph() {
  const xs = [9, 46, 83];
  return (
    <Svg id="inside-metro">
      <path d="M4 12H116" />
      <path d="M44 12V21M76 12V21" strokeWidth="3.5" />
      <rect x="34" y="21" width="52" height="15" rx="5" fill={K} />
      <circle className="g-inside-metro-dot" cx="45" cy="28.5" r="3.2" fill={POP} stroke="none" />
      <path d="M55 28.5H76M71 24.5L76 28.5L71 32.5" stroke={P} strokeWidth="2.8" />
      {xs.map((x, i) => (
        <g key={i}>
          <rect className={`g-inside-metro-h${i + 1}`} x={x - 5} y="41" width="38" height="52" rx="8" fill={S} stroke="none" />
          <rect x={x} y="46" width="28" height="42" rx="4" fill={P} />
          <g className={`g-inside-metro-l${i + 1}`}>
            <rect x={x} y="46" width="28" height="42" rx="4" fill={POP} />
            <g stroke="none" fill={P}>
              {i === 0 && (
                <>
                  <circle cx={x + 14} cy="60" r="7" />
                  <rect x={x + 6} y="73" width="16" height="5" rx="2.5" />
                </>
              )}
              {i === 1 && (
                <>
                  <rect x={x + 6} y="54" width="16" height="5" rx="2.5" />
                  <rect x={x + 6} y="63" width="11" height="5" rx="2.5" />
                  <circle cx={x + 17} cy="77" r="5" fill={K} />
                </>
              )}
              {i === 2 && (
                <>
                  <path d={`M${x + 14} 53L${x + 22} 68H${x + 6}Z`} />
                  <rect x={x + 6} y="74" width="16" height="5" rx="2.5" fill={K} />
                </>
              )}
            </g>
          </g>
        </g>
      ))}
      <path d="M-4 99H124" />
      <path className="g-inside-metro-floor" d="M8 109H114" stroke={A} strokeWidth="4" strokeDasharray="7 9" />
    </Svg>
  );
}
