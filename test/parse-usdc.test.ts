
import { test, describe, it } from 'node:test';
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
    // Current implementation uses parseFloat, so it will lose precision here
    // Expected: 9007199254740993000000n
    // Actual (with float): 9007199254740992000000n (due to float precision limit at 2^53)

    // We expect the safe implementation to handle this correctly.
    // For now, let's just log what happens or assert the safe behavior (which will fail currently)
    assert.strictEqual(parseUSDC(largeStr), 9007199254740993000000n);
  });

  it('should throw error for invalid characters', () => {
    // Current implementation: parseFloat("10abc") -> 10. Returns 10000000n.
    // Safe implementation should throw.
    assert.throws(() => parseUSDC('10abc'), /Invalid USDC amount format/);
  });

  it('should throw error for too many decimals', () => {
    // Current implementation: rounds.
    // Safe implementation should probably throw or truncate strict?
    // Usually throw is safer to avoid implicit loss.
    assert.throws(() => parseUSDC('1.1234567'), /Too many decimals/);
  });

  it('should throw error for multiple decimal points', () => {
    // Current implementation: parseFloat("1.2.3") -> 1.2
    assert.throws(() => parseUSDC('1.2.3'), /Invalid USDC amount format/);
  });
});
