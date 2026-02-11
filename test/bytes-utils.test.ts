
import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { toBytes32, randomBytes32 } from '../src/utils/index';

describe('Byte Utils Tests', () => {
  it('should convert string to bytes32', () => {
    const input = 'test string';
    const result = toBytes32(input);
    assert.strictEqual(result.startsWith('0x'), true);
    assert.strictEqual(result.length, 66); // 0x + 64 chars
  });

  it('should handle hex string input for toBytes32', () => {
    const input = '0x1234567890abcdef';
    const result = toBytes32(input);
    assert.strictEqual(result.startsWith('0x'), true);
    assert.strictEqual(result.length, 66);
    assert.strictEqual(result.slice(0, 18), '0x1234567890abcdef');
  });

  it('should generate random bytes32', () => {
    const result1 = randomBytes32();
    const result2 = randomBytes32();
    assert.strictEqual(result1.startsWith('0x'), true);
    assert.strictEqual(result1.length, 66);
    assert.notStrictEqual(result1, result2);
  });
});
