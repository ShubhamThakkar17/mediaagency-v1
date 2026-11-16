import { describe, expect, it } from 'vitest';
import { formatCountCompact, formatCountRange, formatINR, formatINRCompact, formatINRRange, groupIndian, parseINR } from './format-inr';

describe('groupIndian', () => {
  it('groups digits the Indian way', () => {
    expect(groupIndian(0)).toBe('0');
    expect(groupIndian(999)).toBe('999');
    expect(groupIndian(1000)).toBe('1,000');
    expect(groupIndian(99999)).toBe('99,999');
    expect(groupIndian(100000)).toBe('1,00,000');
    expect(groupIndian(1250000)).toBe('12,50,000');
    expect(groupIndian(10000000)).toBe('1,00,00,000');
    expect(groupIndian(1234567890)).toBe('1,23,45,67,890');
  });
  it('rounds and keeps the sign', () => {
    expect(groupIndian(1234.6)).toBe('1,235');
    expect(groupIndian(-1250000)).toBe('-12,50,000');
  });
});

describe('formatINR', () => {
  it('prefixes the rupee sign', () => {
    expect(formatINR(1250000)).toBe('₹12,50,000');
    expect(formatINR(300)).toBe('₹300');
    expect(formatINR(1500)).toBe('₹1,500');
  });
});

describe('formatINRCompact', () => {
  it('uses lakh and crore', () => {
    expect(formatINRCompact(5000000)).toBe('₹50 L');
    expect(formatINRCompact(12500000)).toBe('₹1.25 Cr');
    expect(formatINRCompact(100000)).toBe('₹1 L');
    expect(formatINRCompact(150000)).toBe('₹1.5 L');
    expect(formatINRCompact(125000)).toBe('₹1.25 L');
    expect(formatINRCompact(4250000)).toBe('₹42.5 L');
    expect(formatINRCompact(10000000)).toBe('₹1 Cr');
    expect(formatINRCompact(100000000)).toBe('₹10 Cr');
    expect(formatINRCompact(75000)).toBe('₹75,000');
    expect(formatINRCompact(0)).toBe('₹0');
  });
  it('formats ranges', () => {
    expect(formatINRRange(450000, 1200000)).toBe('₹4.5 L to ₹12 L');
    expect(formatINRRange(500000, 500000)).toBe('₹5 L');
  });
});

describe('formatCountCompact', () => {
  it('uses Indian units for counts', () => {
    expect(formatCountCompact(950)).toBe('950');
    expect(formatCountCompact(1500)).toBe('1.5K');
    expect(formatCountCompact(120000)).toBe('1.2 L');
    expect(formatCountCompact(34000000)).toBe('3.4 Cr');
    expect(formatCountRange(1800000, 4200000)).toBe('18 L to 42 L');
  });
});

describe('parseINR', () => {
  it('parses plain and grouped numbers', () => {
    expect(parseINR('1250000')).toBe(1250000);
    expect(parseINR('12,50,000')).toBe(1250000);
    expect(parseINR('₹12,50,000')).toBe(1250000);
    expect(parseINR(' ₹ 40,00,000 ')).toBe(4000000);
  });
  it('parses lakh, crore and thousand suffixes', () => {
    expect(parseINR('50L')).toBe(5000000);
    expect(parseINR('50 lakh')).toBe(5000000);
    expect(parseINR('2.5 lakhs')).toBe(250000);
    expect(parseINR('1.25 cr')).toBe(12500000);
    expect(parseINR('1.25 Crore')).toBe(12500000);
    expect(parseINR('75k')).toBe(75000);
  });
  it('returns null for anything else', () => {
    expect(parseINR('')).toBeNull();
    expect(parseINR('abc')).toBeNull();
    expect(parseINR('-5')).toBeNull();
    expect(parseINR('12 apples')).toBeNull();
  });
  it('round trips with the formatters', () => {
    expect(parseINR(formatINR(1250000))).toBe(1250000);
    expect(parseINR(formatINRCompact(12500000))).toBe(12500000);
    expect(parseINR(formatINRCompact(5000000))).toBe(5000000);
  });
});
