import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { formatAddress } from '../src/utils';

describe('formatAddress', () => {
  it('should truncate 42-character address correctly (default)', () => {
    const address = '0x1234567890123456789012345678901234567890';
    assert.strictEqual(address.length, 42);
    // 0x1234...7890 (6...4)
    const expected = '0x1234...7890';
    assert.strictEqual(formatAddress(address), expected);
  });

  it('should return non-42-character strings as-is (legacy behavior)', () => {
    const short = '0x123';
    assert.strictEqual(formatAddress(short), short);

    const long = '0x' + '1'.repeat(64); // 66 chars
    assert.strictEqual(long.length, 66);
    assert.strictEqual(formatAddress(long), long);
  });

  it('should support custom start length', () => {
    const address = '0x1234567890123456789012345678901234567890';
    // start=8, end=4 (default)
    // 0x123456...7890
    assert.strictEqual(formatAddress(address, { start: 8 }), '0x123456...7890');
  });

  it('should support custom end length', () => {
    const address = '0x1234567890123456789012345678901234567890';
    // start=6 (default), end=6
    // 0x1234...567890
    assert.strictEqual(formatAddress(address, { end: 6 }), '0x1234...567890');
  });

  it('should support custom start and end length', () => {
    const address = '0x1234567890123456789012345678901234567890';
    // start=4, end=2
    // 0x12...90
    assert.strictEqual(formatAddress(address, { start: 4, end: 2 }), '0x12...90');
  });

  it('should truncate non-42-character strings if options provided', () => {
    const long = '0x' + '1'.repeat(64); // 66 chars (e.g. tx hash)
    // Should truncate with default 6...4 if empty options provided
    assert.strictEqual(formatAddress(long, {}), `0x1111...1111`);

    // Custom options
    // 0x11...11
    assert.strictEqual(formatAddress(long, { start: 4, end: 2 }), '0x11...11');
  });

  it('should handle short strings gracefully with options', () => {
    const short = 'Alice';
    // 5 chars <= 6+4 (10), so should return as is
    assert.strictEqual(formatAddress(short, {}), 'Alice');

    // Even if we ask for very short truncation
    // start=1, end=1 -> 2. 5 > 2. So 'A...e'
    assert.strictEqual(formatAddress(short, { start: 1, end: 1 }), 'A...e');

    // start=2, end=3 -> 5. 5 <= 5. Return as is.
    assert.strictEqual(formatAddress(short, { start: 2, end: 3 }), 'Alice');
  });

  it('should handle empty options object (defaults)', () => {
    const address = '0x1234567890123456789012345678901234567890';
    // Equivalent to no options but uses new logic branch
    assert.strictEqual(formatAddress(address, {}), '0x1234...7890');
  });

  it('should handle end: 0 correctly (truncate suffix completely)', () => {
    const address = '0x1234567890123456789012345678901234567890';
    // start=6, end=0 -> 0x1234...
    assert.strictEqual(formatAddress(address, { start: 6, end: 0 }), '0x1234...');
  });
});
