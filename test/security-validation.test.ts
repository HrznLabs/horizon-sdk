
import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateFeeSplit, formatBps, formatUSDC } from '../src/utils/index';

describe('Security Validation Improvements', () => {
  describe('calculateFeeSplit', () => {
    it('should throw strictly "Guild fee must be an integer" for NaN', () => {
      try {
        calculateFeeSplit(100n, NaN);
        assert.fail('Should have thrown');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Guild fee must be an integer');
      }
    });

    it('should throw strictly "Guild fee must be an integer" for floats', () => {
      try {
        calculateFeeSplit(100n, 1.5);
        assert.fail('Should have thrown');
      } catch (e: any) {
        assert.strictEqual(e.message, 'Guild fee must be an integer');
      }
    });

    it('should allow valid integers', () => {
      const split = calculateFeeSplit(10000n, 300);
      assert.strictEqual(split.guildAmount, 300n);
    });
  });

  describe('formatBps', () => {
    it('should handle huge minDecimals by capping at 100', () => {
      // Should not throw RangeError
      const result = formatBps(100, { minDecimals: 101 });
      // 100 bps = 1%. 1% as string "1". With 101 decimals -> "1." + 100 zeros.
      // But we cap at 100.
      assert.strictEqual(result.length > 100, true);
      assert.ok(result.endsWith('%'));
    });
  });

  describe('formatUSDC', () => {
    it('should handle huge minDecimals by capping at 100', () => {
      // Should not create massive string
      const result = formatUSDC(100n, { minDecimals: 200 });
      // 100n = 0.000100 USDC.
      // With minDecimals capped at 100, length should be reasonable.
      // 0. + 100 chars max.
      assert.ok(result.length <= 105, `Length ${result.length} should be <= 105`);
    });
  });
});
