

import { describe, it, expect } from 'vitest';
import { toBytes32 } from '../src/utils/index';

describe('toBytes32 Hex Validation', () => {
  it('should throw error for invalid hex characters after 0x prefix', () => {
    const invalidInputs = [
      '0xZZ',         // Invalid characters
      '0x123G',       // Invalid character at end
      '0x-1',         // Invalid sign
      '0x ',          // Space
      '0x12.34',      // Decimal point
      '0xhello',      // Non-hex word
    ];

    for (const input of invalidInputs) {
      expect(() => toBytes32(input), `Should throw for input: ${input}`).toThrow(/Invalid hex string/);
    }
  });

  it('should accept valid hex strings', () => {
    const validInputs = [
      '0x',                 // Empty hex (should result in 32 zero bytes)
      '0x1234567890abcdef', // Lowercase
      '0x1234567890ABCDEF', // Uppercase
      '0x0',                // Single zero
      '0x1',                // Single digit
    ];

    for (const input of validInputs) {
      expect(() => toBytes32(input), `Should not throw for input: ${input}`).not.toThrow();
      const result = toBytes32(input);
      expect(result.startsWith('0x'), `Result should start with 0x: ${result}`).toBeTruthy();
      expect(result.length, `Result length should be 66 (0x + 64 chars): ${result}`).toBe(66);
    }
  });

  it('should accept strings without 0x prefix (treated as utf8)', () => {
    const rawStrings = [
      'hello world',
      'ZZ',
      '123G',
    ];

    for (const input of rawStrings) {
      expect(() => toBytes32(input), `Should not throw for raw string: ${input}`).not.toThrow();
      const result = toBytes32(input);
      expect(result.startsWith('0x'), `Result should start with 0x: ${result}`).toBeTruthy();
      expect(result.length, `Result length should be 66: ${result}`).toBe(66);
    }
  });
});
