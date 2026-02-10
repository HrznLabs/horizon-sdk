
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { parseUSDC, formatUSDC } from '../src/utils/index';

describe('USDC Utils', () => {
  describe('parseUSDC', () => {
    it('should parse simple integers correctly', () => {
      assert.strictEqual(parseUSDC("100"), 100000000n);
    });

    it('should parse decimals correctly', () => {
      assert.strictEqual(parseUSDC("100.5"), 100500000n);
      assert.strictEqual(parseUSDC(".5"), 500000n);
    });

    it('should handle commas correctly', () => {
      // "1,000" -> 1000 USDC (1000 * 10^6)
      assert.strictEqual(parseUSDC("1,000"), 1000000000n);
      assert.strictEqual(parseUSDC("1,000.50"), 1000500000n);
    });

    it('should throw error for invalid characters', () => {
      assert.throws(() => {
        parseUSDC("10abc");
      }, /Invalid USDC amount/);

      assert.throws(() => {
        parseUSDC("1.2.3");
      }, /Invalid USDC amount/);
    });

    it('should truncate extra decimals', () => {
        // "1.1234567" -> "1.123456"
        assert.strictEqual(parseUSDC("1.1234567"), 1123456n);
    });

    it('should parse negative numbers correctly', () => {
        assert.strictEqual(parseUSDC("-100"), -100000000n);
        assert.strictEqual(parseUSDC("-1.5"), -1500000n);
    });

    it('should parse numbers using toFixed behavior', () => {
        assert.strictEqual(parseUSDC(100), 100000000n);
        assert.strictEqual(parseUSDC(100.5), 100500000n);
    });
  });

  describe('formatUSDC', () => {
      it('should format simple integers correctly', () => {
          assert.strictEqual(formatUSDC(100000000n), "100.000000");
      });

      it('should format decimals correctly', () => {
          assert.strictEqual(formatUSDC(100500000n), "100.500000");
          assert.strictEqual(formatUSDC(500000n), "0.500000");
      });

      it('should format negative numbers correctly', () => {
          // -1.5 USDC = -1500000n
          assert.strictEqual(formatUSDC(-1500000n), "-1.500000");

          // -0.5 USDC = -500000n
          assert.strictEqual(formatUSDC(-500000n), "-0.500000");
      });
  });
});
