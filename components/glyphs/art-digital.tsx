import { K, A, P, S, POP, TINT, Svg } from './base';

/** n-point star path centred on (cx, cy). */
function starPath(cx: number, cy: number, outer: number, inner: number, n: number) {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i * 180) / n - 90;
    const rad = (a * Math.PI) / 180;
    pts.push(`${(cx + Math.cos(rad) * r).toFixed(2)} ${(cy + Math.sin(rad) * r).toFixed(2)}`);
  }
  return `M${pts.join('L')}Z`;
}

const STAR = starPath(60, 57, 41, 31, 12);
const SPARK = 'M0 -9Q1.4 -1.4 9 0Q1.4 1.4 0 9Q-1.4 1.4 -9 0Q-1.4 -1.4 0 -9Z';
export const HEART = 'M0 7C-8 1 -10 -3 -10 -6.5A5 5 0 0 1 0 -8A5 5 0 0 1 10 -6.5C10 -3 8 1 0 7Z';

/** Brand ambassadors: a star burst; a camera flash; a spotlight cone sweeps. */
export function AmbassadorGlyph() {
  return (
    <Svg id="ambassador">
      <path className="g-ambassador-cone" d="M53 12L18 110H102L67 12Z" fill={S} stroke="none" />
      <g className="g-ambassador-star g-o-c">
        <path d={STAR} fill={A} stroke="none" />
      </g>
      <g className="g-ambassador-sp1 g-o-c">
        <path d={SPARK} transform="translate(14 26)" fill={A} stroke="none" />
      </g>
      <g className="g-ambassador-sp2 g-o-c">
        <path d={SPARK} transform="translate(106 22) scale(0.8)" fill={A} stroke="none" />
      </g>
      <path d="M49 4H71L66 13H54Z" fill={K} />
      <path d="M35 100V89Q35 63 60 63Q85 63 85 89V100Z" fill={K} />
      <path d="M53 64L60 75L67 64" stroke={P} strokeWidth="3.2" />
      <circle cx="60" cy="47" r="11.5" fill={P} />
      <rect x="12" y="99" width="82" height="12" rx="5" fill={P} />
      <g className="g-ambassador-flash g-o-c">
        <path d={SPARK} transform="translate(89 66) scale(1.25)" fill={P} strokeWidth="2.6" />
      </g>
      <g transform="translate(78 76)">
        <rect x="4" y="1" width="12" height="7" rx="2" fill={K} stroke="none" />
        <rect x="0" y="6" width="34" height="23" rx="5" fill={P} />
        <circle cx="19" cy="17.5" r="7" fill={K} stroke="none" />
        <circle cx="16.5" cy="15" r="2.2" fill={P} stroke="none" />
        <circle className="g-ambassador-bulb" cx="10" cy="4.5" r="2.4" fill={POP} stroke="none" />
      </g>
    </Svg>
  );
}

const HEARTS = [
  { x: 97, y: 102, s: 1.3, d: '0s' },
  { x: 104, y: 76, s: 1, d: '-0.8s' },
  { x: 93, y: 52, s: 0.85, d: '-1.6s' },
];

/** Influencers: a phone with a reel progress bar; hearts float up. */
export function InfluencerGlyph() {
  return (
    <Svg id="influencer">
      <rect x="20" y="6" width="58" height="108" rx="12" fill={P} />
      <svg x="27" y="17" width="44" height="85">
        <rect width="44" height="85" fill={POP} stroke="none" />
        <g className="g-influencer-person" stroke="none">
          <circle cx="22" cy="34" r="10" fill={P} />
          <path d="M3 90V70Q3 51 22 51Q41 51 41 70V90Z" fill={K} />
        </g>
        <path d="M6 8L11 11L6 14Z" fill={P} stroke={P} strokeWidth="2.4" />
        <rect x="5" y="76" width="34" height="4.5" rx="2.25" fill={P} opacity="0.4" stroke="none" />
        <rect className="g-influencer-prog g-o-l" x="5" y="76" width="34" height="4.5" rx="2.25" fill={P} stroke="none" />
      </svg>
      <rect x="27" y="17" width="44" height="85" rx="3" strokeWidth="3.5" />
      <path d="M43 11.5H55" strokeWidth="3.5" />
      <path d="M42 108H56" strokeWidth="3" />
      {HEARTS.map((h, i) => (
        <g key={i} transform={`translate(${h.x} ${h.y}) scale(${h.s})`}>
          <g className="g-influencer-heart" style={{ animationDelay: h.d }}>
            <path d={HEART} fill={A} strokeWidth={3.6 / h.s} />
          </g>
        </g>
      ))}
    </Svg>
  );
}

function FeedPost({ n, y }: { n: 1 | 2 | 3; y: number }) {
  return (
    <g transform={`translate(0 ${y})`} stroke="none">
      {n === 1 && (
        <>
          <rect width="88" height="44" rx="6" fill={POP} />
          <circle cx="66" cy="14" r="7.5" fill={P} />
          <path d="M6 44L28 18L42 33L52 25L72 44Z" fill={K} />
        </>
      )}
      {n === 2 && (
        <>
          <rect width="88" height="44" rx="6" fill={TINT} />
          <circle cx="26" cy="22" r="13" fill={POP} />
          <rect x="48" y="13" width="30" height="7" rx="3.5" fill={K} />
          <rect x="48" y="25" width="20" height="6" rx="3" fill={POP} />
        </>
      )}
      {n === 3 && (
        <>
          <rect width="88" height="44" rx="6" fill={K} />
          <circle cx="44" cy="22" r="12" fill={POP} />
          <path d="M40 15.5L50 22L40 28.5Z" fill={P} />
        </>
      )}
      <rect y="49" width={n === 2 ? 40 : 54} height="6" rx="3" fill={K} />
    </g>
  );
}

function Counter({ x, cls }: { x: number; cls: string }) {
  const widths = [6, 10, 14, 18];
  return (
    <svg x={x} y="92" width="20" height="12">
      <g className={cls} stroke="none" fill={K}>
        {widths.map((w, i) => (
          <rect key={i} x="1" y={i * 12 + 3} width={w} height="6" rx="3" />
        ))}
      </g>
    </svg>
  );
}

/** Social: a feed scrolls; like/comment counters tick up. */
export function SocialGlyph() {
  return (
    <Svg id="social">
      <rect x="8" y="8" width="104" height="104" rx="13" fill={P} />
      <circle cx="22" cy="21" r="6" fill={POP} stroke="none" />
      <path d="M34 18H62" strokeWidth="4" />
      <path d="M34 25.5H50" strokeWidth="3" stroke={TINT} />
      <circle cx="92" cy="21" r="2.3" fill={K} stroke="none" />
      <circle cx="100" cy="21" r="2.3" fill={K} stroke="none" />
      <svg x="16" y="32" width="88" height="56">
        <g className="g-social-feed">
          <FeedPost n={1} y={0} />
          <FeedPost n={2} y={60} />
          <FeedPost n={3} y={120} />
          <FeedPost n={1} y={180} />
        </g>
      </svg>
      <g transform="translate(24 98.5) scale(0.82)">
        <g className="g-social-like g-o-c">
          <path d={HEART} fill={POP} strokeWidth="3.6" />
        </g>
      </g>
      <Counter x={33} cls="g-social-c1" />
      <path d="M66 92.5A6.5 5.8 0 1 1 61.2 103.3L57 105L58.4 101A6.5 5.8 0 0 1 66 92.5Z" strokeWidth="3.2" />
      <Counter x={76} cls="g-social-c2" />
      <path d="M96 99L106 93.5L102.5 104.5L100 100Z" strokeWidth="3" fill={TINT} />
    </Svg>
  );
}

const CURSOR = 'M0 0V17L4.6 12.8L7.8 19.6L11 18.1L7.9 11.5H14Z';

/** Search & performance: a search bar types a query; a results bar chart rises; a cursor clicks. */
export function SearchGlyph() {
  const bars = [
    { x: 17, h: 22, fill: S },
    { x: 39, h: 34, fill: S },
    { x: 61, h: 46, fill: S },
    { x: 83, h: 60, fill: A },
  ];
  return (
    <Svg id="search">
      <rect x="7" y="9" width="106" height="28" rx="14" fill={P} />
      <circle cx="22" cy="22" r="5.5" strokeWidth="3.5" />
      <path d="M26.2 26.4L30 30.2" strokeWidth="3.5" />
      <path className="g-search-query g-o-l" d="M37 23H71" strokeWidth="5" />
      <g className="g-search-caret">
        <path className="g-search-caret-move" d="M77 16V30" strokeWidth="3" stroke={POP} />
      </g>
      <circle className="g-search-ripple g-o-c" cx="98" cy="23" r="9" stroke={A} strokeWidth="3" />
      <g className="g-search-btn g-o-c">
        <circle cx="98" cy="23" r="9" fill={POP} strokeWidth="3.5" />
        <path d="M94 23H102M98.5 19.5L102 23L98.5 26.5" stroke={P} strokeWidth="2.8" />
      </g>
      {bars.map((b, i) => (
        <rect
          key={i}
          className="g-search-bar g-o-b"
          style={{ animationDelay: `${i * 0.09}s` }}
          x={b.x}
          y={106 - b.h}
          width="16"
          height={b.h}
          rx="3"
          fill={b.fill}
        />
      ))}
      <path d="M8 106H112" />
      <g transform="translate(101 27)">
        <g className="g-search-cursor">
          <path d={CURSOR} fill={P} strokeWidth="3" />
        </g>
      </g>
    </Svg>
  );
}

/** Digital PR: an article card with a headline highlight sweep; share icons pop. */
export function DigitalPrGlyph() {
  const icons = [28, 60, 92];
  return (
    <Svg id="digital-pr">
      <rect x="7" y="9" width="76" height="102" rx="8" fill={P} />
      <path d="M17 21H49" strokeWidth="5" />
      <circle cx="72" cy="21" r="3.5" fill={POP} stroke="none" />
      <rect x="17" y="31" width="56" height="28" rx="4" fill={TINT} strokeWidth="3.5" />
      <circle cx="29" cy="41" r="4.5" fill={POP} stroke="none" />
      <path d="M19.5 57L36 45L47 53L55 47.5L70.5 57Z" fill={K} stroke="none" />
      <rect className="g-digital-pr-hl g-o-l" x="14" y="65" width="62" height="23" rx="4" fill={POP} stroke="none" />
      <path d="M20 71.5H70M20 81.5H56" strokeWidth="5.5" />
      <path d="M19 95H71M19 102H58" strokeWidth="3" />
      <path className="g-digital-pr-link" d="M83 28H89M83 60H89M83 92H89" strokeWidth="3" strokeDasharray="0.1 5" />
      {icons.map((y, i) => (
        <g key={y} className="g-digital-pr-icon g-o-c" style={{ animationDelay: `${i * 0.15}s` }}>
          <circle cx="101" cy={y} r="11" fill={A} strokeWidth="4" />
          {i === 0 && (
            <g transform={`translate(101 ${y})`} fill={K} stroke={K} strokeWidth="2.4">
              <path d="M-4 0L4 -4.5M-4 0L4 4.5" />
              <circle cx="-4" cy="0" r="2.4" stroke="none" />
              <circle cx="4" cy="-4.5" r="2.4" stroke="none" />
              <circle cx="4" cy="4.5" r="2.4" stroke="none" />
            </g>
          )}
          {i === 1 && <path d={HEART} transform={`translate(101 ${y + 0.5}) scale(0.55)`} fill={K} stroke="none" />}
          {i === 2 && <path d={`M96 ${y + 5}L106 ${y - 5}M99.5 ${y - 5}H106V${y + 1.5}`} stroke={K} strokeWidth="3" />}
        </g>
      ))}
    </Svg>
  );
}
