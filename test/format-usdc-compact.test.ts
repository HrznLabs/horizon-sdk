import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { formatUSDC } from '../src/utils/index';

describe('formatUSDC Compact Formatting', () => {
  const K = 1000n;
  const M = 1000000n;
  const B = 1000000000n;
  const T = 1000000000000n;
  const USDC_MULTIPLIER = 1000000n;

  it('should format compact notation for K', () => {
    // 1k USDC
    assert.strictEqual(
      formatUSDC(K * USDC_MULTIPLIER, { compact: true }),
      '1k'
    );
    // 1.5k USDC
    assert.strictEqual(
      formatUSDC(1500n * USDC_MULTIPLIER, { compact: true }),
      '1.5k'
    );
    // 999k USDC
    assert.strictEqual(
      formatUSDC(999000n * USDC_MULTIPLIER, { compact: true }),
      '999k'
    );
  });

  it('should format compact notation for M', () => {
    // 1M USDC
    assert.strictEqual(
      formatUSDC(M * USDC_MULTIPLIER, { compact: true }),
      '1M'
    );
    // 1.5M USDC
    assert.strictEqual(
      formatUSDC(1500000n * USDC_MULTIPLIER, { compact: true }),
      '1.5M'
    );
  });

  it('should format compact notation for B', () => {
    // 1B USDC
    assert.strictEqual(
      formatUSDC(B * USDC_MULTIPLIER, { compact: true }),
      '1B'
    );
    // 2.5B USDC
    assert.strictEqual(
      formatUSDC(2500000000n * USDC_MULTIPLIER, { compact: true }),
      '2.5B'
    );
  });

  it('should format compact notation for T', () => {
    // 1T USDC
    assert.strictEqual(
      formatUSDC(T * USDC_MULTIPLIER, { compact: true }),
      '1T'
    );
    // 10T USDC
    assert.strictEqual(
      formatUSDC(10000000000000n * USDC_MULTIPLIER, { compact: true }),
      '10T'
    );
  });

  it('should handle small numbers without compact formatting', () => {
    // 500 USDC
    assert.strictEqual(
      formatUSDC(500n * USDC_MULTIPLIER, { compact: true }),
      '500'
    );
    // 999 USDC
    assert.strictEqual(
      formatUSDC(999n * USDC_MULTIPLIER, { compact: true }),
      '999'
    );
  });

  it('should handle negative numbers', () => {
    // -1.5M USDC
    assert.strictEqual(
      formatUSDC(-1500000n * USDC_MULTIPLIER, { compact: true }),
      '-1.5M'
    );
  });

  it('should handle prefixes and suffixes', () => {
    // $1.5M
    assert.strictEqual(
      formatUSDC(1500000n * USDC_MULTIPLIER, { compact: true, prefix: '$' }),
      '$1.5M'
    );
    // 1.5M USDC
    assert.strictEqual(
      formatUSDC(1500000n * USDC_MULTIPLIER, { compact: true, suffix: ' USDC' }),
      '1.5M USDC'
    );
    // $1.5M USD
    assert.strictEqual(
      formatUSDC(1500000n * USDC_MULTIPLIER, { compact: true, prefix: '$', suffix: ' USD' }),
      '$1.5M USD'
    );
  });

  it('should handle minDecimals with compact notation', () => {
    // 1.5M -> 1.50M
    assert.strictEqual(
      formatUSDC(1500000n * USDC_MULTIPLIER, { compact: true, minDecimals: 2 }),
      '1.50M'
    );
    // 1M -> 1.00M
    assert.strictEqual(
      formatUSDC(1000000n * USDC_MULTIPLIER, { compact: true, minDecimals: 2 }),
      '1.00M'
    );
  });

  it('should handle fractional compact values correctly', () => {
    // 1234 USDC -> 1.234k
    assert.strictEqual(
      formatUSDC(1234n * USDC_MULTIPLIER, { compact: true }),
      '1.234k'
    );
    // 1,500,100 USDC -> 1.5001M
    assert.strictEqual(
      formatUSDC(1500100n * USDC_MULTIPLIER, { compact: true }),
      '1.5001M'
    );
  });
});
