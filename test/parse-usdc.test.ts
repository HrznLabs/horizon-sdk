
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { parseUSDC } from '../src/utils/index';

describe('parseUSDC Security Checks', () => {
  it('should parse valid string amounts correctly', () => {
    assert.strictEqual(parseUSDC('1'), 1000000n);
    assert.strictEqual(parseUSDC('1.5'), 1500000n);
    assert.strictEqual(parseUSDC('0.000001'), 1n);
    assert.strictEqual(parseUSDC('0'), 0n);
  });

  it('should handle large numbers correctly without precision loss', () => {
    // 2^53 + 1 is not safe integer in JS number, but valid in string -> BigInt
    // 9007199254740993
    const largeStr = '9007199254740993';
    assert.strictEqual(parseUSDC(largeStr), 9007199254740993000000n);
  });

  it('should handle negative numbers correctly', () => {
    assert.strictEqual(parseUSDC('-10'), -10000000n);
    assert.strictEqual(parseUSDC('-10.5'), -10500000n);
    assert.strictEqual(parseUSDC('-0.5'), -500000n);
  });

  it('should throw error for invalid characters', () => {
    assert.throws(() => parseUSDC('10abc'), {
      message: /Invalid character found/
    });
  });

  it('should throw error for too many decimals', () => {
    assert.throws(() => parseUSDC('1.1234567'), {
      message: /Too many decimals/
    });
  });

  it('should throw error for multiple decimal points', () => {
    assert.throws(() => parseUSDC('1.2.3'), {
      message: /Multiple decimal points found/
    });
  });

  it('should throw specific error for commas', () => {
    assert.throws(() => parseUSDC('1,000'), {
      message: /Commas are not allowed, please remove thousands separators/
    });
  });

  it('should throw specific error for currency symbols', () => {
    assert.throws(() => parseUSDC('$100'), {
      message: /Currency symbols are not allowed/
    });
  });

  it('should throw specific error for spaces', () => {
    assert.throws(() => parseUSDC('100 00'), {
      message: /Spaces are not allowed/
    });
  });

  it('should throw error for numbers with too many decimals', () => {
    // 1.1234569.toString() = "1.1234569" (7 decimals)
    assert.throws(() => parseUSDC(1.1234569), {
      message: /Too many decimals/
    });
  });

  it('should throw error for scientific notation (unsafe or non-standard)', () => {
    // 1e-7.toString() = "1e-7" which contains 'e'
    assert.throws(() => parseUSDC(1e-7), {
      message: /Invalid character found/
    });
  });

  it('should accept safe numbers', () => {
    assert.strictEqual(parseUSDC(1.5), 1500000n);
    assert.strictEqual(parseUSDC(100), 100000000n);
    // 0.57 previously failed safe integer check due to float math, but toString() fixes it
    assert.strictEqual(parseUSDC(0.57), 570000n);
  });
});
