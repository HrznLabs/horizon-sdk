
import { describe, it, expect } from 'vitest';
import { toBytes32, randomBytes32 } from '../src/utils/index';

describe('Byte Utils Tests', () => {
  it('should convert string to bytes32', () => {
    const input = 'test string';
    const result = toBytes32(input);
    expect(result.startsWith('0x')).toBe(true);
    expect(result.length).toBe(66); // 0x + 64 chars
  });

  it('should handle hex string input for toBytes32', () => {
    const input = '0x1234567890abcdef';
    const result = toBytes32(input);
    expect(result.startsWith('0x')).toBe(true);
    expect(result.length).toBe(66);
    expect(result.slice(0, 18)).toBe('0x1234567890abcdef');
  });

  it('should generate random bytes32', () => {
    const result1 = randomBytes32();
    const result2 = randomBytes32();
    expect(result1.startsWith('0x')).toBe(true);
    expect(result1.length).toBe(66);
    expect(result1).not.toBe(result2);
  });

  it('should throw error for string longer than 32 bytes', () => {
    const input = 'a'.repeat(33);
    expect(() => toBytes32(input)).toThrow('String too long for bytes32: 33 bytes (max 32)');
  });

  it('should throw error for hex string longer than 64 characters (32 bytes)', () => {
    const input = '0x' + '1'.repeat(65);
    expect(() => toBytes32(input)).toThrow('String too long for bytes32');
  });

  it('should throw error for excessively long string exceeding max limit', () => {
    // 300 characters
    const input = 'a'.repeat(300);
    assert.throws(
      () => toBytes32(input),
      {
        message: 'String too long for bytes32: exceeds maximum input length',
      }
    );
  });
});
