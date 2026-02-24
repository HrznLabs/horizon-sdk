import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { formatUSDC } from '../src/utils/index';

describe('formatUSDC maxDecimals option', () => {
  it('should truncate decimals to maxDecimals', () => {
    // 1.123456 -> 1.12
    assert.strictEqual(formatUSDC(1123456n, { maxDecimals: 2 }), '1.12');

    // 1.555555 -> 1.55 (truncation, not rounding)
    assert.strictEqual(formatUSDC(1555555n, { maxDecimals: 2 }), '1.55');
  });

  it('should handle maxDecimals with trailing zeros', () => {
    // 1.200000 -> 1.2
    assert.strictEqual(formatUSDC(1200000n, { maxDecimals: 2 }), '1.2');

    // 1.000000 -> 1
    assert.strictEqual(formatUSDC(1000000n, { maxDecimals: 2 }), '1');
  });

  it('should respect minDecimals alongside maxDecimals', () => {
    // 1.234567 -> 1.23
    assert.strictEqual(formatUSDC(1234567n, { minDecimals: 2, maxDecimals: 2 }), '1.23');

    // 1.2 -> 1.20
    assert.strictEqual(formatUSDC(1200000n, { minDecimals: 2, maxDecimals: 2 }), '1.20');

    // 1 -> 1.00
    assert.strictEqual(formatUSDC(1000000n, { minDecimals: 2, maxDecimals: 2 }), '1.00');
  });

  it('should handle maxDecimals: 0', () => {
    // 1.123456 -> 1
    assert.strictEqual(formatUSDC(1123456n, { maxDecimals: 0 }), '1');

    // 1.999999 -> 1
    assert.strictEqual(formatUSDC(1999999n, { maxDecimals: 0 }), '1');
  });

  it('should handle negative numbers', () => {
    // -1.123456 -> -1.12
    assert.strictEqual(formatUSDC(-1123456n, { maxDecimals: 2 }), '-1.12');
  });

  it('should do nothing if decimals are fewer than maxDecimals', () => {
    // 1.5 -> 1.5 (max 4)
    assert.strictEqual(formatUSDC(1500000n, { maxDecimals: 4 }), '1.5');
  });
});
