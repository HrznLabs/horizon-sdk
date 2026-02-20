
import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { parseUSDC, formatUSDC } from '../src/utils/index';

describe('USDC Utility Security Checks', () => {
  describe('parseUSDC', () => {
    it('should parse valid integers correctly', () => {
      assert.strictEqual(parseUSDC('100'), 100000000n);
    });

    it('should parse valid decimals correctly', () => {
      assert.strictEqual(parseUSDC('10.5'), 10500000n);
    });

    it('should throw error for inputs with commas', () => {
      // Currently this parses as 1, which is dangerous
      assert.throws(() => {
        parseUSDC('1,000');
      }, /Commas are not allowed/);
    });

    it('should throw error for inputs with multiple decimals', () => {
      assert.throws(() => {
        parseUSDC('10.5.5');
      }, /Multiple decimal points found/);
    });

    it('should throw error for non-numeric characters', () => {
      assert.throws(() => {
        parseUSDC('100abc');
      }, /Invalid character 'a' found/);
    });

    it('should throw error for negative numbers if not supported (or just parse correctly)', () => {
       // Assuming we might want to support negative balances, but if not, we should block it.
       // The current implementation allows it. Let's stick to format validation for now.
       // If "1,000" is passed, parseFloat sees "1".
    });
  });

  describe('formatUSDC', () => {
    it('should format correctly', () => {
      assert.strictEqual(formatUSDC(10500000n), '10.5');
    });

    it('should format integer amounts without decimals', () => {
      assert.strictEqual(formatUSDC(100000000n), '100');
    });

    it('should format negative numbers correctly', () => {
      assert.strictEqual(formatUSDC(-1500000n), '-1.5');
    });

    it('should format zero correctly', () => {
      assert.strictEqual(formatUSDC(0n), '0');
    });
  });
});
