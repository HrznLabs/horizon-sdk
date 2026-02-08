
import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { parseUSDC } from '../src/utils/index';

describe('parseUSDC UX Improvements', () => {
  it('should parse valid string inputs correctly', () => {
    assert.strictEqual(parseUSDC('10'), 10000000n);
    assert.strictEqual(parseUSDC('10.5'), 10500000n);
    assert.strictEqual(parseUSDC('0.5'), 500000n);
    assert.strictEqual(parseUSDC('.5'), 500000n);
    assert.strictEqual(parseUSDC('100.123456'), 100123456n);
  });

  it('should handle number inputs correctly', () => {
    assert.strictEqual(parseUSDC(10), 10000000n);
    assert.strictEqual(parseUSDC(10.5), 10500000n);
  });

  it('should throw clear error for non-numeric strings', () => {
    assert.throws(() => parseUSDC('abc'), /Invalid USDC amount: "abc"/);
    assert.throws(() => parseUSDC('10abc'), /Invalid USDC amount: "10abc"/);
    assert.throws(() => parseUSDC('xyz10'), /Invalid USDC amount: "xyz10"/);
  });

  it('should throw clear error for empty strings', () => {
    assert.throws(() => parseUSDC(''), /Invalid USDC amount: ""/);
    assert.throws(() => parseUSDC('   '), /Invalid USDC amount: "   "/);
  });

  it('should throw clear error for multiple decimal points', () => {
    assert.throws(() => parseUSDC('10.5.5'), /Invalid USDC amount: "10.5.5"/);
    assert.throws(() => parseUSDC('..5'), /Invalid USDC amount: "..5"/);
  });

  it('should throw clear error for invalid characters like commas', () => {
    assert.throws(() => parseUSDC('10,5'), /Invalid USDC amount: "10,5"/);
  });

  it('should handle too many decimals by truncating or throwing (decision: throw for precision loss warning or truncate? let\'s stick to current behavior of rounding but maybe warn? No, strict validation means strict. Let\'s allow extra decimals but round them, consistent with current behavior, OR strict error? Current behavior rounds. Let\'s keep rounding behavior but validate format first.)', () => {
    // If I use strict regex validation, I can still allow extra decimals and round.
    // "10.1234567" -> 10123457n (rounded)
    assert.strictEqual(parseUSDC('10.1234567'), 10123457n);
  });
});
