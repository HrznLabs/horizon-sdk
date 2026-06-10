
import { describe, it, expect } from 'vitest';
import { formatUSDC } from '../src/utils/index';

describe('formatUSDC Compact Notation', () => {
  it('should format thousands with K', () => {
    expect(formatUSDC(1000000000n, { compact: true })).toBe('1K');
    expect(formatUSDC(1500000000n, { compact: true })).toBe('1.5K');
    expect(formatUSDC(100000000000n, { compact: true })).toBe('100K');
  });

  it('should format millions with M', () => {
    expect(formatUSDC(1000000000000n, { compact: true })).toBe('1M');
    expect(formatUSDC(1500000000000n, { compact: true })).toBe('1.5M');
  });

  it('should format billions with B', () => {
    expect(formatUSDC(1000000000000000n, { compact: true })).toBe('1B');
    expect(formatUSDC(1500000000000000n, { compact: true })).toBe('1.5B');
  });

  it('should format trillions with T', () => {
    expect(formatUSDC(1000000000000000000n, { compact: true })).toBe('1T');
  });

  it('should handle small numbers normally', () => {
    expect(formatUSDC(100000000n, { compact: true })).toBe('100');
    expect(formatUSDC(999000000n, { compact: true })).toBe('999');
  });

  it('should handle negative numbers', () => {
    expect(formatUSDC(-1500000000n, { compact: true })).toBe('-1.5K');
  });

  it('should combine with prefix', () => {
    expect(formatUSDC(1500000000n, { compact: true, prefix: '$' })).toBe('$1.5K');
    expect(formatUSDC(-1500000000n, { compact: true, prefix: '$' })).toBe('-$1.5K');
  });

  it('should ignore commas option when compact is true', () => {
    expect(formatUSDC(1500000000n, { compact: true, commas: true })).toBe('1.5K');
  });

  it('should handle decimal precision correctly in compact mode', () => {
    expect(formatUSDC(1234560000n, { compact: true })).toBe('1.23K');
  });

  it('should respect minDecimals in compact mode', () => {
    expect(formatUSDC(1000000000n, { compact: true, minDecimals: 2 })).toBe('1.00K');
    expect(formatUSDC(1500000000n, { compact: true, minDecimals: 2 })).toBe('1.50K');
    expect(formatUSDC(1000000000000n, { compact: true, minDecimals: 3 })).toBe('1.000M');
  });
});
