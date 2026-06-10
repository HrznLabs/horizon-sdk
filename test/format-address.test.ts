
import { describe, it, expect } from 'vitest';
import { formatAddress } from '../src/utils';

describe('formatAddress', () => {
  it('should truncate 42-character address correctly (default)', () => {
    const address = '0x1234567890123456789012345678901234567890';
    expect(address.length).toBe(42);
    // Legacy no-options path uses typographic ellipsis (…)
    const expected = '0x1234…7890';
    expect(formatAddress(address)).toBe(expected);
  });

  it('should return non-42-character strings as-is (legacy behavior)', () => {
    const short = '0x123';
    expect(formatAddress(short)).toBe(short);

    const long = '0x' + '1'.repeat(64); // 66 chars
    expect(long.length).toBe(66);
    expect(formatAddress(long)).toBe(long);
  });

  it('should support custom start length', () => {
    const address = '0x1234567890123456789012345678901234567890';
    expect(formatAddress(address, { start: 8 })).toBe('0x123456...7890');
  });

  it('should support custom end length', () => {
    const address = '0x1234567890123456789012345678901234567890';
    expect(formatAddress(address, { end: 6 })).toBe('0x1234...567890');
  });

  it('should support custom start and end length', () => {
    const address = '0x1234567890123456789012345678901234567890';
    expect(formatAddress(address, { start: 4, end: 2 })).toBe('0x12...90');
  });

  it('should truncate non-42-character strings if options provided', () => {
    const long = '0x' + '1'.repeat(64); // 66 chars (e.g. tx hash)
    expect(formatAddress(long, {})).toBe('0x1111...1111');
    expect(formatAddress(long, { start: 4, end: 2 })).toBe('0x11...11');
  });

  it('should handle short strings gracefully with options', () => {
    const short = 'Alice';
    // len=5, start=6 (default), end=4 (default), sep='...' (3): 5 <= 13 → return as-is
    expect(formatAddress(short, {})).toBe('Alice');
    // len=5, start=1, end=1, sep='...' (3): 5 <= 1+1+3=5 → return as-is (short-circuit)
    expect(formatAddress(short, { start: 1, end: 1 })).toBe('Alice');
    // len=5, start=2, end=3, sep='...' (3): 5 <= 2+3+3=8 → return as-is
    expect(formatAddress(short, { start: 2, end: 3 })).toBe('Alice');
  });

  it('should handle empty options object (defaults)', () => {
    const address = '0x1234567890123456789012345678901234567890';
    expect(formatAddress(address, {})).toBe('0x1234...7890');
  });

  it('should handle end: 0 correctly (truncate suffix completely)', () => {
    const address = '0x1234567890123456789012345678901234567890';
    expect(formatAddress(address, { start: 6, end: 0 })).toBe('0x1234...');
  });

  it('should support custom separators', () => {
    const address = '0x1234567890123456789012345678901234567890';
    // Typographic ellipsis
    expect(formatAddress(address, { separator: '…' })).toBe('0x1234…7890');
    // Custom dash
    expect(formatAddress(address, { start: 4, end: 4, separator: '-' })).toBe('0x12-7890');
  });

  it('should throw an error for non-string inputs', () => {
    expect(() => formatAddress(null as any)).toThrow(/Address must be a string/);
    expect(() => formatAddress(undefined as any)).toThrow(/Address must be a string/);
    expect(() => formatAddress(123 as any)).toThrow(/Address must be a string/);
    expect(() => formatAddress({} as any)).toThrow(/Address must be a string/);
  });
});
