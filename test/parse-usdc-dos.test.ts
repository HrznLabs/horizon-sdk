

import { describe, it, expect } from 'vitest';
import { parseUSDC } from '../src/utils/index';

describe('parseUSDC DoS Protection', () => {
  it('should reject strings longer than 32 characters', () => {
    const longString = '100000000000000000000000000000000'; // 33 chars
    expect(() => parseUSDC(longString)).toThrow(/Invalid USDC amount format: Input too long./);
  });

  it('should accept strings up to 32 characters', () => {
    const validString = '10000000000000000000000000000000'; // 32 chars
    expect(() => parseUSDC(validString)).not.toThrow();
  });

  it('should handle formatted strings within limit', () => {
    const formatted = '12345678901234567890.123456'; // 27 chars
    expect(() => parseUSDC(formatted)).not.toThrow();
  });
});
