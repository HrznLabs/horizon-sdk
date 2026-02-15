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
});
