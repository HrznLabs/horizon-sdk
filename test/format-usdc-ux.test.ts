import { describe, it } from 'node:test';
import assert from 'node:assert';
import { formatUSDC } from '../src/utils/index';

describe('formatUSDC UX Enhancements', () => {
  it('should format integer amounts with commas', () => {
    assert.strictEqual(formatUSDC(1000000000n), '1,000');
    assert.strictEqual(formatUSDC(10000000000n), '10,000');
    assert.strictEqual(formatUSDC(1000000000000n), '1,000,000');
  });

  it('should format decimal amounts with commas and trim zeros', () => {
    assert.strictEqual(formatUSDC(1234560000n), '1,234.56');
    assert.strictEqual(formatUSDC(10500000n), '10.5');
  });

  it('should handle small amounts', () => {
    assert.strictEqual(formatUSDC(500000n), '0.5');
    assert.strictEqual(formatUSDC(10000n), '0.01');
    assert.strictEqual(formatUSDC(1n), '0.000001');
  });

  it('should handle zero', () => {
    assert.strictEqual(formatUSDC(0n), '0');
  });

  it('should handle negative amounts', () => {
    assert.strictEqual(formatUSDC(-1000000000n), '-1,000');
    assert.strictEqual(formatUSDC(-10500000n), '-10.5');
    assert.strictEqual(formatUSDC(-500000n), '-0.5');
  });
});
