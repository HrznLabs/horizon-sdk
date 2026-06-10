
import { describe, it, expect } from 'vitest';
import { formatUSDC } from '../src/utils/index';

describe('formatUSDC UX Improvements', () => {
  it('should format negative numbers correctly', () => {
    expect(formatUSDC(-10500000n)).toBe('-10.5');
    expect(formatUSDC(-1000000n)).toBe('-1');
    expect(formatUSDC(-500000n)).toBe('-0.5');
  });

  it('should format with commas', () => {
    expect(formatUSDC(1000000000n)).toBe('1,000');
    expect(formatUSDC(1000000000000n)).toBe('1,000,000');
    expect(formatUSDC(1234567000000n)).toBe('1,234,567');
  });

  it('should trim trailing zeros', () => {
    expect(formatUSDC(10500000n)).toBe('10.5');
    expect(formatUSDC(10000000n)).toBe('10');
    expect(formatUSDC(1000000n)).toBe('1');
    expect(formatUSDC(1234567n)).toBe('1.234567');
    expect(formatUSDC(1500000n)).toBe('1.5');
  });

  it('should handle zero', () => {
    expect(formatUSDC(0n)).toBe('0');
  });

  it('should handle complex cases', () => {
    expect(formatUSDC(-1234567890000n)).toBe('-1,234,567.89');
  });

  it('should respect minDecimals option', () => {
    expect(formatUSDC(1000000n, { minDecimals: 2 })).toBe('1.00');
    expect(formatUSDC(1500000n, { minDecimals: 2 })).toBe('1.50');
    expect(formatUSDC(1555000n, { minDecimals: 2 })).toBe('1.555');
  });

  it('should handle zero with minDecimals', () => {
    expect(formatUSDC(0n, { minDecimals: 2 })).toBe('0.00');
  });

  it('should handle negative numbers with minDecimals', () => {
    expect(formatUSDC(-1000000n, { minDecimals: 2 })).toBe('-1.00');
  });

  it('should default to trimming zeros if minDecimals is 0 or undefined', () => {
    expect(formatUSDC(1000000n)).toBe('1');
    expect(formatUSDC(1000000n, { minDecimals: 0 })).toBe('1');
  });

  it('should handle prefix option', () => {
    expect(formatUSDC(10000000n, { prefix: '$' })).toBe('$10');
    expect(formatUSDC(-10000000n, { prefix: '$' })).toBe('-$10');
    expect(formatUSDC(500000n, { prefix: 'USDC ' })).toBe('USDC 0.5');
  });

  it('should handle commas option', () => {
    expect(formatUSDC(1234567000000n, { commas: false })).toBe('1234567');
    expect(formatUSDC(1234567000000n, { commas: true })).toBe('1,234,567');
    expect(formatUSDC(1000000n, { commas: false })).toBe('1');
  });

  it('should combine options correctly', () => {
    expect(formatUSDC(-1234500000n, { prefix: '$', minDecimals: 2 })).toBe('-$1,234.50');
    expect(formatUSDC(-1234500000n, { prefix: '$', minDecimals: 2, commas: false })).toBe('-$1234.50');
  });

  it('should handle suffix option', () => {
    expect(formatUSDC(10000000n, { suffix: ' USDC' })).toBe('10 USDC');
    expect(formatUSDC(10500000n, { suffix: ' USDC' })).toBe('10.5 USDC');
    expect(formatUSDC(10000000n, { prefix: '$', suffix: ' USD' })).toBe('$10 USD');
    expect(formatUSDC(-10000000n, { suffix: ' USDC' })).toBe('-10 USDC');
  });

  it('should handle showPlusSign option correctly', () => {
    expect(formatUSDC(1500000n, { showPlusSign: true })).toBe('+1.5');
    expect(formatUSDC(-1500000n, { showPlusSign: true })).toBe('-1.5');
    expect(formatUSDC(0n, { showPlusSign: true })).toBe('0');
    expect(formatUSDC(1500000n, { prefix: '$', showPlusSign: true })).toBe('+$1.5');
    expect(formatUSDC(1500000000n, { prefix: '$', compact: true, showPlusSign: true })).toBe('+$1.5K');
  });

  it('should respect maxDecimals option', () => {
    // Standard format truncation without rounding
    assert.strictEqual(formatUSDC(1555555n, { maxDecimals: 2 }), '1.55');
    assert.strictEqual(formatUSDC(1555555n, { maxDecimals: 0 }), '1');
    assert.strictEqual(formatUSDC(1555555n, { maxDecimals: 4 }), '1.5555');

    // Should not trim more than requested if there are zeros inside
    assert.strictEqual(formatUSDC(1005000n, { maxDecimals: 2 }), '1'); // .00 becomes empty string

    // Test that minDecimals supersedes lower maxDecimals input
    assert.strictEqual(formatUSDC(1555555n, { minDecimals: 3, maxDecimals: 2 }), '1.555');

    // Test maxDecimals in compact notation
    // 1555000n * 100n / 1000000n = 155500000n / 1000000n = 155n.
    // Wait, compact with M uses divisor 1_000_000_000_000n (for 1M USDC).
    // Let's test 1.555M
    const millionVal = 1555555n * 1000000n; // 1,555,555 USDC
    assert.strictEqual(formatUSDC(millionVal, { compact: true }), '1.55M'); // Default max 2 for compact
    assert.strictEqual(formatUSDC(millionVal, { compact: true, maxDecimals: 1 }), '1.5M');
    assert.strictEqual(formatUSDC(millionVal, { compact: true, maxDecimals: 0 }), '1M');
  });
});
