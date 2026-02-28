import { describe, it } from 'node:test';
import assert from 'node:assert';
import { formatUSDC } from '../src/utils/index';

describe('formatUSDC Compact Notation', () => {
  it('should format thousands with K', () => {
    // 1,000 -> 1K
    assert.strictEqual(formatUSDC(1000000000n, { compact: true }), '1K');
    // 1,500 -> 1.5K
    assert.strictEqual(formatUSDC(1500000000n, { compact: true }), '1.5K');
    // 100,000 -> 100K
    assert.strictEqual(formatUSDC(100000000000n, { compact: true }), '100K');
  });

  it('should format millions with M', () => {
    // 1,000,000 -> 1M
    assert.strictEqual(formatUSDC(1000000000000n, { compact: true }), '1M');
    // 1,500,000 -> 1.5M
    assert.strictEqual(formatUSDC(1500000000000n, { compact: true }), '1.5M');
  });

  it('should format billions with B', () => {
    // 1,000,000,000 -> 1B
    assert.strictEqual(formatUSDC(1000000000000000n, { compact: true }), '1B');
    // 1,500,000,000 -> 1.5B
    assert.strictEqual(formatUSDC(1500000000000000n, { compact: true }), '1.5B');
  });

  it('should format trillions with T', () => {
    // 1,000,000,000,000 -> 1T
    assert.strictEqual(formatUSDC(1000000000000000000n, { compact: true }), '1T');
  });

  it('should handle small numbers normally', () => {
    // 100 -> 100
    assert.strictEqual(formatUSDC(100000000n, { compact: true }), '100');
    // 999 -> 999
    assert.strictEqual(formatUSDC(999000000n, { compact: true }), '999');
  });

  it('should handle negative numbers', () => {
    // -1,500 -> -1.5K
    assert.strictEqual(formatUSDC(-1500000000n, { compact: true }), '-1.5K');
  });

  it('should combine with prefix', () => {
    // $1.5K
    assert.strictEqual(formatUSDC(1500000000n, { compact: true, prefix: '$' }), '$1.5K');
    // -$1.5K
    assert.strictEqual(formatUSDC(-1500000000n, { compact: true, prefix: '$' }), '-$1.5K');
  });

  it('should ignore commas option when compact is true', () => {
    // 1.5K (not 1,5K or anything weird)
    assert.strictEqual(formatUSDC(1500000000n, { compact: true, commas: true }), '1.5K');
  });

  it('should handle decimal precision correctly in compact mode', () => {
    // 1,234 -> 1.23K (default to up to 2 decimals usually, or whatever implementation decides)
    // 1234.56 -> 1.23K
    assert.strictEqual(formatUSDC(1234560000n, { compact: true }), '1.23K');
  });
});
