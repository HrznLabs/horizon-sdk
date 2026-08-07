
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
    expect(() => toBytes32(input)).toThrow('String too long for bytes32: exceeds maximum input length');
  });
});

describe('toBytes32 hex validation edge cases', () => {
  // The validation regex uses `*` not `+` on purpose: the hand-rolled
  // charCodeAt loop it replaced also accepted a bare '0x' (its body never ran).
  // Guards against "fixes" that flip this to `+` or add an `i` flag.
  it('accepts a bare 0x prefix, matching pre-regex behaviour', () => {
    expect(() => toBytes32('0x')).not.toThrow();
  });

  // Uppercase 0X is NOT treated as a hex prefix (the check is charCodeAt(1)===120,
  // lowercase only), so it falls through and is encoded as a literal string.
  // Documented deliberately: a "fix" adding an `i` flag would silently change this.
  it('treats uppercase 0X as a literal string, not hex', () => {
    expect(() => toBytes32('0Xdeadbeef')).not.toThrow();
    expect(toBytes32('0Xdeadbeef')).not.toBe('0Xdeadbeef');
  });

  it('rejects non-hex characters after the prefix', () => {
    expect(() => toBytes32('0xzz')).toThrow();
    expect(() => toBytes32('0xdeadbeeg')).toThrow();
  });

  it('accepts mixed-case hex digits', () => {
    expect(() => toBytes32('0xDeAdBeEf')).not.toThrow();
  });
});
