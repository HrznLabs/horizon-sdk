
import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { parseUSDC, formatUSDC } from '../src/utils/index';

describe('USDC Utility Functions', () => {
  describe('parseUSDC', () => {
    it('should parse integer strings', () => {
      assert.strictEqual(parseUSDC('100'), 100000000n);
    });

    it('should parse decimal strings', () => {
      assert.strictEqual(parseUSDC('100.50'), 100500000n);
    });

    it('should parse comma-separated strings', () => {
      assert.strictEqual(parseUSDC('1,000'), 1000000000n);
    });

    it('should parse comma-separated strings with decimals', () => {
      assert.strictEqual(parseUSDC('1,000.50'), 1000500000n);
    });

    it('should throw error for invalid numeric strings', () => {
       assert.throws(() => parseUSDC('abc'), /Invalid number format/);
       assert.throws(() => parseUSDC('100abc'), /Invalid number format/);
    });

    it('should handle numbers', () => {
      assert.strictEqual(parseUSDC(100), 100000000n);
      assert.strictEqual(parseUSDC(100.5), 100500000n);
    });
  });

  describe('formatUSDC', () => {
    it('should format integers', () => {
      assert.strictEqual(formatUSDC(100000000n), '100.000000');
    });

    it('should format decimals', () => {
      assert.strictEqual(formatUSDC(100500000n), '100.500000');
    });
  });
});
