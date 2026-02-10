
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { toBytes32, randomBytes32 } from '../src/utils/index';

describe('Byte Utils', () => {
  describe('toBytes32', () => {
    it('should convert empty string correctly', () => {
      const result = toBytes32('');
      assert.strictEqual(result, '0x' + '0'.repeat(64));
    });

    it('should convert regular string correctly', () => {
      const input = 'hello';
      const result = toBytes32(input);
      // 'hello' in hex is 68656c6c6f
      const expected = '0x68656c6c6f' + '0'.repeat(64 - 10);
      assert.strictEqual(result, expected);
    });

    it('should pad hex string correctly', () => {
      const input = '0x1234';
      const result = toBytes32(input);
      const expected = '0x1234' + '0'.repeat(64 - 4);
      assert.strictEqual(result, expected);
    });

    it('should handle exactly 32 bytes (64 hex chars)', () => {
      const input = '0x' + 'a'.repeat(64);
      const result = toBytes32(input);
      assert.strictEqual(result, input);
    });
  });

  describe('randomBytes32', () => {
    it('should return a 32-byte hex string', () => {
      const result = randomBytes32();
      assert.match(result, /^0x[0-9a-f]{64}$/);
    });

    it('should return different values on subsequent calls', () => {
      const r1 = randomBytes32();
      const r2 = randomBytes32();
      assert.notStrictEqual(r1, r2);
    });
  });
});
