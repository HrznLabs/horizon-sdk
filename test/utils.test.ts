import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { formatUSDC } from '../src/utils/index';
import { USDC_DECIMALS } from '../src/constants';

describe('formatUSDC', () => {
  it('should format simple amounts', () => {
    assert.strictEqual(formatUSDC(1000000n), '1');
    assert.strictEqual(formatUSDC(10000000n), '10');
  });

  it('should format amounts with commas', () => {
    assert.strictEqual(formatUSDC(1000000000n), '1,000');
    assert.strictEqual(formatUSDC(1000000000000n), '1,000,000');
  });

  it('should format small amounts correctly', () => {
    assert.strictEqual(formatUSDC(500000n), '0.5');
  });

  it('should handle zero', () => {
    assert.strictEqual(formatUSDC(0n), '0');
  });
});
