
import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { toBytes32, randomBytes32 } from '../src/utils/index';

describe('Byte Utils Tests', () => {
  it('toBytes32 should handle hex strings correctly', () => {
    const input = '0x1234567890abcdef';
    const result = toBytes32(input);
    assert.strictEqual(result.startsWith('0x'), true);
    assert.strictEqual(result.length, 66); // 0x + 64 hex chars
    assert.strictEqual(result.slice(0, input.length), input);
    assert.match(result, /^0x[0-9a-f]{64}$/);
  });

  it('toBytes32 should handle regular strings correctly', () => {
    const input = 'hello world';
    const result = toBytes32(input);
    assert.strictEqual(result.startsWith('0x'), true);
    assert.strictEqual(result.length, 66);
    // 'hello world' in hex: 68656c6c6f20776f726c64
    assert.strictEqual(result.slice(0, 24), '0x68656c6c6f20776f726c64');
  });

  it('randomBytes32 should generate valid bytes32 hex string', () => {
    const result = randomBytes32();
    assert.strictEqual(result.startsWith('0x'), true);
    assert.strictEqual(result.length, 66);
    assert.match(result, /^0x[0-9a-f]{64}$/);
  });

  it('randomBytes32 should generate different values', () => {
    const val1 = randomBytes32();
    const val2 = randomBytes32();
    assert.notStrictEqual(val1, val2);
  });
});
