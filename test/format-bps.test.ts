import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { formatBps } from '../src/utils/index';

describe('formatBps UX Improvements', () => {
  it('should format standard basis points', () => {
    assert.strictEqual(formatBps(150), '1.5%');
    assert.strictEqual(formatBps(400), '4%');
    assert.strictEqual(formatBps(100), '1%');
    assert.strictEqual(formatBps(30), '0.3%');
    assert.strictEqual(formatBps(5), '0.05%');
  });

  it('should handle zero', () => {
    assert.strictEqual(formatBps(0), '0%');
  });

  it('should handle negative numbers', () => {
    assert.strictEqual(formatBps(-150), '-1.5%');
    assert.strictEqual(formatBps(-100), '-1%');
    assert.strictEqual(formatBps(-5), '-0.05%');
  });

  it('should respect minDecimals option', () => {
    assert.strictEqual(formatBps(150, { minDecimals: 2 }), '1.50%');
    assert.strictEqual(formatBps(100, { minDecimals: 2 }), '1.00%');
    assert.strictEqual(formatBps(0, { minDecimals: 2 }), '0.00%');
    assert.strictEqual(formatBps(5, { minDecimals: 2 }), '0.05%');
  });

  it('should handle prefix option', () => {
    assert.strictEqual(formatBps(150, { prefix: '+' }), '+1.5%');
    assert.strictEqual(formatBps(-150, { prefix: '$' }), '-$1.5%');
  });

  it('should handle suffix option', () => {
    assert.strictEqual(formatBps(150, { suffix: ' percent' }), '1.5 percent');
    assert.strictEqual(formatBps(100, { suffix: '' }), '1');
  });

  it('should combine options', () => {
    assert.strictEqual(formatBps(150, { minDecimals: 2, prefix: '+', suffix: '' }), '+1.50');
  });

  it('should handle minDecimals > 2 (padding)', () => {
    assert.strictEqual(formatBps(150, { minDecimals: 3 }), '1.500%');
  });

  it('should handle fractional basis points (floats)', () => {
    assert.strictEqual(formatBps(150.5), '1.505%');
    assert.strictEqual(formatBps(33.33), '0.3333%');
    assert.strictEqual(formatBps(0.5), '0.005%');
  });

  it('should handle fractional basis points with minDecimals', () => {
    assert.strictEqual(formatBps(150.5, { minDecimals: 2 }), '1.505%'); // Should not truncate
    assert.strictEqual(formatBps(150.5, { minDecimals: 4 }), '1.5050%'); // Should pad
  });
});
