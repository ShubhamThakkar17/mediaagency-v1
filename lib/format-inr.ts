/** Indian digit grouping: 1250000 -> "12,50,000". */
export function groupIndian(n: number): string {
  const neg = n < 0;
  const s = Math.round(Math.abs(n)).toString();
  if (s.length <= 3) return (neg ? '-' : '') + s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${neg ? '-' : ''}${rest},${last3}`;
}

/** Full rupee amount: "₹12,50,000". */
export function formatINR(n: number): string {
  return `₹${groupIndian(n)}`;
}

function trim(n: number, digits: number) {
  return n.toFixed(digits).replace(/\.?0+$/, '');
}

/** Compact lakh / crore: "₹50 L", "₹1.25 Cr", "₹75,000". */
export function formatINRCompact(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1e7) return `${sign}₹${trim(abs / 1e7, abs >= 1e9 ? 0 : 2)} Cr`;
  if (abs >= 1e5) return `${sign}₹${trim(abs / 1e5, abs >= 1e6 ? 1 : 2)} L`;
  return `${sign}₹${groupIndian(abs)}`;
}

/** Range in compact form: "₹4.5 L to ₹12 L". */
export function formatINRRange(low: number, high: number): string {
  if (Math.round(low) === Math.round(high)) return formatINRCompact(low);
  return `${formatINRCompact(low)} to ${formatINRCompact(high)}`;
}

/** Counts in Indian units: 1,20,000 -> "1.2 L", 3,40,00,000 -> "3.4 Cr". */
export function formatCountCompact(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1e7) return `${trim(abs / 1e7, abs >= 1e8 ? 1 : 2)} Cr`;
  if (abs >= 1e5) return `${trim(abs / 1e5, abs >= 1e6 ? 1 : 2)} L`;
  if (abs >= 1e3) return `${trim(abs / 1e3, 1)}K`;
  return `${Math.round(abs)}`;
}

export function formatCountRange(low: number, high: number): string {
  return `${formatCountCompact(low)} to ${formatCountCompact(high)}`;
}

/** Parses user input such as "12,50,000", "50L", "1.25 cr" into rupees. */
export function parseINR(input: string): number | null {
  const s = input.trim().toLowerCase().replace(/[₹,\s]/g, '');
  if (!s) return null;
  const m = s.match(/^(\d+(?:\.\d+)?)(cr|crore|crores|l|lac|lakh|lakhs|k)?$/);
  if (!m) return null;
  const value = parseFloat(m[1]);
  const unit = m[2] ?? '';
  const mult = unit.startsWith('cr') ? 1e7 : unit.startsWith('l') ? 1e5 : unit === 'k' ? 1e3 : 1;
  return Math.round(value * mult);
}
