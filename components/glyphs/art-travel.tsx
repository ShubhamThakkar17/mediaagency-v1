import { K, A, P, S, POP, TINT, Svg } from './base';

const RAIL = 'M-12 94C32 94 30 62 60 62S88 30 132 30';

/** Railways: a train snakes across (top view) with carriages appearing one by one. */
export function RailwaysGlyph() {
  return (
    <Svg id="railways">
      <path d="M22 54V28" strokeWidth="3.5" />
      <rect x="15" y="9" width="14" height="22" rx="5" fill={K} />
      <circle className="g-railways-signal" cx="22" cy="16" r="3" fill={POP} stroke="none" />
      <circle cx="22" cy="24" r="3" fill={P} stroke="none" opacity="0.5" />
      <path d="M97 97V106" strokeWidth="3.5" />
      <circle cx="97" cy="87" r="10" fill={S} strokeWidth="3.5" />
      <path d={RAIL} stroke={S} strokeWidth="21" strokeLinecap="butt" />
      <path d={RAIL} strokeWidth="13" strokeDasharray="2.6 7.4" strokeLinecap="butt" />
      <path d={RAIL} strokeWidth="3" />
      <path className="g-railways-train" d={RAIL} strokeWidth="12.5" strokeDasharray="8 15 8 15 8 15 8 400" />
      <path className="g-railways-train" d={RAIL} stroke={A} strokeWidth="6.5" strokeDasharray="8 15 8 15 8 423" />
      <path className="g-railways-lamp" d={RAIL} stroke={P} strokeWidth="5" strokeDasharray="0.1 476.9" />
    </Svg>
  );
}

const LETTERS: Record<string, string> = {
  B: 'M0 0H6.5Q11 0 11 4Q11 8 6.5 8H0M6.5 8Q12 8 12 12Q12 16 6.5 16H0V0',
  O: 'M6 0Q12 0 12 6V10Q12 16 6 16Q0 16 0 10V6Q0 0 6 0Z',
  M: 'M0 16V0L6 8L12 0V16',
  D: 'M0 0H5Q12 0 12 8Q12 16 5 16H0Z',
  E: 'M11.5 0H0V16H11.5M0 8H8',
  L: 'M0.5 0V16H11.5',
};

const PLANE =
  'M14 0C14 -2 11 -3 8 -3H3L-3 -13H-7L-3.5 -3H-8L-11 -7H-13.5L-12 0L-13.5 7H-11L-8 3H-3.5L-7 13H-3L3 3H8C11 3 14 2 14 0Z';

/** Airport: a departure board with flipping split-flap letters, then a plane icon. */
export function AirportGlyph() {
  const cells: [string, string][] = [
    ['B', 'D'],
    ['O', 'E'],
    ['M', 'L'],
  ];
  return (
    <Svg id="airport">
      <path d="M32 5V16M88 5V16" />
      <rect x="9" y="16" width="102" height="80" rx="9" fill={P} />
      {cells.map(([a, b], i) => {
        const style = { animationDelay: `${i * 0.2}s` };
        return (
          <g key={i} transform={`translate(${19 + i * 29} 25)`}>
            <g className="g-airport-flap g-o-c" style={style}>
              <rect width="24" height="31" rx="4.5" fill={K} stroke="none" />
              <path d={LETTERS[b]} transform="translate(6 7.5)" stroke={P} strokeWidth="3.6" />
              <g className="g-airport-a" style={style}>
                <rect width="24" height="31" rx="4.5" fill={K} stroke="none" />
                <path d={LETTERS[a]} transform="translate(6 7.5)" stroke={P} strokeWidth="3.6" />
              </g>
              <path d="M0 15.5H24" stroke={K} strokeWidth="1.3" strokeLinecap="butt" />
            </g>
          </g>
        );
      })}
      <path className="g-airport-bar1 g-o-l" d="M49 71H77" />
      <path className="g-airport-bar2 g-o-l" d="M49 81H67" stroke={TINT} />
      <circle className="g-airport-status" cx="93" cy="76" r="6.5" fill={POP} stroke="none" />
      <g transform="translate(31 76)">
        <g className="g-airport-plane">
          <path d={PLANE} transform="scale(0.8)" fill={POP} stroke="none" />
        </g>
      </g>
    </Svg>
  );
}

function Pin({ x, y, fill }: { x: number; y: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0C-9 -10 -10 -15 -10 -19A10 10 0 1 1 10 -19C10 -15 9 -10 0 0Z" fill={fill} />
      <circle cx="0" cy="-19" r="3.4" fill={P} stroke="none" />
    </g>
  );
}

const ROUTE = 'M16 98A44 44 0 0 1 104 98';

/** Airline: a plane crosses a dotted route arc between two pins. */
export function AirlineGlyph() {
  return (
    <Svg id="airline">
      <g className="g-airline-cloud1" fill={S} stroke="none">
        <circle cx="16" cy="32" r="7" />
        <circle cx="26" cy="28" r="9" />
        <circle cx="35" cy="33" r="6" />
        <rect x="16" y="31" width="19" height="8" />
      </g>
      <g className="g-airline-cloud2" fill={S} stroke="none">
        <circle cx="84" cy="22" r="6" />
        <circle cx="93" cy="18" r="8" />
        <circle cx="102" cy="23" r="5.5" />
        <rect x="84" y="20" width="18" height="8" />
      </g>
      <path d={ROUTE} strokeWidth="3.6" strokeDasharray="0.1 9.77" />
      <path className="g-airline-trail" d={ROUTE} stroke={A} pathLength={100} strokeDasharray="100 100" />
      <Pin x={16} y={99} fill={K} />
      <g className="g-airline-dest g-o-b">
        <Pin x={104} y={99} fill={A} />
      </g>
      <g className="g-airline-plane g-o-vb" style={{ transformOrigin: '60px 98px' }}>
        <path d={PLANE} transform="translate(60 54) scale(1.25)" fill={A} strokeWidth="2.6" />
      </g>
    </Svg>
  );
}

function Floodlight({ x }: { x: number }) {
  return (
    <g>
      <path d={`M${x} 80V30`} />
      <rect x={x - 12} y="9" width="24" height="21" rx="4.5" fill={P} />
      <g className="g-stadium-lamps" fill={POP} stroke="none">
        <circle cx={x - 5.5} cy="16" r="2.4" />
        <circle cx={x + 5.5} cy="16" r="2.4" />
        <circle cx={x - 5.5} cy="23.5" r="2.4" />
        <circle cx={x + 5.5} cy="23.5" r="2.4" />
      </g>
    </g>
  );
}

/** Stadiums: a cricket ball follows an arc; an LED perimeter board scrolls. */
export function StadiumGlyph() {
  const led = [0, 60, 120];
  return (
    <Svg id="stadium">
      <Floodlight x={19} />
      <Floodlight x={101} />
      <path d="M10 96A50 50 0 0 1 110 96" strokeWidth="3" strokeDasharray="0.1 8.7" opacity="0.4" />
      <g className="g-stadium-arc g-o-vb" style={{ transformOrigin: '60px 96px' }}>
        <g transform="translate(60 46)">
          <g className="g-stadium-spin g-o-c">
            <circle r="9" fill={A} />
            <path d="M-3.4 -8Q0 0 -3.4 8M3.4 -8Q0 0 3.4 8" strokeWidth="2.2" />
          </g>
        </g>
      </g>
      <rect x="-6" y="78" width="132" height="25" fill={K} />
      <svg x="0" y="80" width="120" height="21">
        <g className="g-stadium-led" stroke="none">
          {led.map((x) => (
            <g key={x} transform={`translate(${x} 0)`}>
              <circle cx="10" cy="10.5" r="5.5" fill={POP} />
              <rect x="20" y="6.5" width="20" height="8" rx="4" fill={P} />
              <rect x="44" y="6.5" width="11" height="8" rx="2.5" fill={POP} />
            </g>
          ))}
        </g>
      </svg>
      <path d="M-4 112H124" stroke={A} strokeWidth="4" />
    </Svg>
  );
}
