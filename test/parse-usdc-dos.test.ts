
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { parseUSDC } from '../src/utils/index';

describe('parseUSDC DoS Protection', () => {
  it('should reject strings longer than 32 characters', () => {
    const longString = '100000000000000000000000000000000'; // 33 chars
    assert.throws(() => {
      parseUSDC(longString);
    }, {
      message: /Invalid USDC amount format: Input too long./
    });
  });

  it('should accept strings up to 32 characters', () => {
    const validString = '10000000000000000000000000000000'; // 32 chars
    // Should not throw (value will be huge but valid BigInt)
    assert.doesNotThrow(() => {
      parseUSDC(validString);
    });
  });

  it('should handle formatted strings within limit', () => {
      // 32 chars: 12345678901234567890.123456
      const formatted = '12345678901234567890.123456'; // 27 chars
      assert.doesNotThrow(() => {
          parseUSDC(formatted);
      });
  });
});
