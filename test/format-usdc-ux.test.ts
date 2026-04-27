import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { formatUSDC } from '../src/utils/index';

describe('formatUSDC UX Improvements', () => {
  it('should format negative numbers correctly', () => {
    assert.strictEqual(formatUSDC(-10500000n), '-10.5');
    assert.strictEqual(formatUSDC(-1000000n), '-1');
    assert.strictEqual(formatUSDC(-500000n), '-0.5');
  });

  it('should format with commas', () => {
    assert.strictEqual(formatUSDC(1000000000n), '1,000');
    assert.strictEqual(formatUSDC(1000000000000n), '1,000,000');
    assert.strictEqual(formatUSDC(1234567000000n), '1,234,567');
  });

  it('should trim trailing zeros', () => {
    assert.strictEqual(formatUSDC(10500000n), '10.5');
    assert.strictEqual(formatUSDC(10000000n), '10');
    assert.strictEqual(formatUSDC(1000000n), '1');
    assert.strictEqual(formatUSDC(1234567n), '1.234567');
    assert.strictEqual(formatUSDC(1500000n), '1.5');
  });

  it('should handle zero', () => {
    assert.strictEqual(formatUSDC(0n), '0');
  });

  it('should handle complex cases', () => {
    assert.strictEqual(formatUSDC(-1234567890000n), '-1,234,567.89');
  });

  it('should respect minDecimals option', () => {
    // 1 USDC -> 1.00
    assert.strictEqual(formatUSDC(1000000n, { minDecimals: 2 }), '1.00');

    // 1.5 USDC -> 1.50
    assert.strictEqual(formatUSDC(1500000n, { minDecimals: 2 }), '1.50');

    // 1.555 USDC -> 1.555 (should not truncate significant digits)
    assert.strictEqual(formatUSDC(1555000n, { minDecimals: 2 }), '1.555');
  });

  it('should handle zero with minDecimals', () => {
    // 0 -> 0.00
    assert.strictEqual(formatUSDC(0n, { minDecimals: 2 }), '0.00');
  });

  it('should handle negative numbers with minDecimals', () => {
    // -1 -> -1.00
    assert.strictEqual(formatUSDC(-1000000n, { minDecimals: 2 }), '-1.00');
  });

  it('should default to trimming zeros if minDecimals is 0 or undefined', () => {
    assert.strictEqual(formatUSDC(1000000n), '1');
    assert.strictEqual(formatUSDC(1000000n, { minDecimals: 0 }), '1');
  });

  it('should handle prefix option', () => {
    assert.strictEqual(formatUSDC(10000000n, { prefix: '$' }), '$10');
    assert.strictEqual(formatUSDC(-10000000n, { prefix: '$' }), '-$10');
    assert.strictEqual(formatUSDC(500000n, { prefix: 'USDC ' }), 'USDC 0.5');
  });

  it('should handle commas option', () => {
    assert.strictEqual(formatUSDC(1234567000000n, { commas: false }), '1234567');
    assert.strictEqual(formatUSDC(1234567000000n, { commas: true }), '1,234,567');
    assert.strictEqual(formatUSDC(1000000n, { commas: false }), '1');
  });

  it('should combine options correctly', () => {
    // -$1,234.50
    assert.strictEqual(
      formatUSDC(-1234500000n, { prefix: '$', minDecimals: 2 }),
      '-$1,234.50'
    );

    // -$1234.50 (no commas)
    assert.strictEqual(
      formatUSDC(-1234500000n, { prefix: '$', minDecimals: 2, commas: false }),
      '-$1234.50'
    );
  });

  it('should handle suffix option', () => {
    assert.strictEqual(formatUSDC(10000000n, { suffix: ' USDC' }), '10 USDC');
    assert.strictEqual(formatUSDC(10500000n, { suffix: ' USDC' }), '10.5 USDC');
    assert.strictEqual(formatUSDC(10000000n, { prefix: '$', suffix: ' USD' }), '$10 USD');
    assert.strictEqual(formatUSDC(-10000000n, { suffix: ' USDC' }), '-10 USDC');
  });

  it('should handle showPlusSign option correctly', () => {
    // Positive number should get a + sign
    assert.strictEqual(formatUSDC(1500000n, { showPlusSign: true }), '+1.5');
    // Negative number should still get a - sign (not +-)
    assert.strictEqual(formatUSDC(-1500000n, { showPlusSign: true }), '-1.5');
    // Zero should not get any sign
    assert.strictEqual(formatUSDC(0n, { showPlusSign: true }), '0');
    // Should combine with prefix cleanly
    assert.strictEqual(formatUSDC(1500000n, { prefix: '$', showPlusSign: true }), '+$1.5');
    assert.strictEqual(formatUSDC(1500000000n, { prefix: '$', compact: true, showPlusSign: true }), '+$1.5K');
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
