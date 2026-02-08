
import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateDDR, calculateLPP, calculateExpiresAt, toBytes32 } from '../src/utils/index';

describe('Utility Function Security Checks', () => {
  describe('calculateDDR', () => {
    it('should calculate correctly for valid inputs', () => {
      const result = calculateDDR(BigInt(10000));
      // 5% of 10000 = 500
      assert.strictEqual(result, 500n);
    });

    it('should throw error for negative rewardAmount', () => {
      assert.throws(() => {
        calculateDDR(-100n);
      }, /Reward amount must be non-negative/);
    });
  });

  describe('calculateLPP', () => {
    it('should calculate correctly for valid inputs', () => {
      const result = calculateLPP(BigInt(10000));
      // 2% of 10000 = 200
      assert.strictEqual(result, 200n);
    });

    it('should throw error for negative rewardAmount', () => {
      assert.throws(() => {
        calculateLPP(-100n);
      }, /Reward amount must be non-negative/);
    });
  });

  describe('calculateExpiresAt', () => {
    it('should return future timestamp for positive duration', () => {
      const now = BigInt(Math.floor(Date.now() / 1000));
      const expiresAt = calculateExpiresAt(3600);
      assert.ok(expiresAt >= now + 3600n);
    });

    it('should throw error for negative duration', () => {
      assert.throws(() => {
        calculateExpiresAt(-1);
      }, /Duration must be non-negative/);
    });
  });

  describe('toBytes32', () => {
    it('should convert valid short string correctly', () => {
      const result = toBytes32('hello');
      // 'hello' in hex is 68656c6c6f
      assert.ok(result.startsWith('0x68656c6c6f'));
      assert.strictEqual(result.length, 66);
    });

    it('should pad valid short hex string correctly', () => {
      const result = toBytes32('0x1234');
      assert.ok(result.startsWith('0x1234'));
      assert.strictEqual(result.length, 66);
    });

    it('should accept valid 32-byte hex string', () => {
      const validHex = '0x' + 'a'.repeat(64);
      const result = toBytes32(validHex);
      assert.strictEqual(result, validHex);
    });

    it('should throw error for string > 32 bytes', () => {
      const longStr = 'a'.repeat(33);
      assert.throws(() => {
        toBytes32(longStr);
      }, /String exceeds 32 bytes/);
    });

    it('should throw error for hex string > 32 bytes', () => {
      const longHex = '0x' + 'a'.repeat(65);
      assert.throws(() => {
        toBytes32(longHex);
      }, /Hex string exceeds 32 bytes/);
    });
  });
});
