
import { describe, it } from 'node:test';
import assert from 'node:assert';
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
      assert.throws(
        () => toBytes32(input),
        {
          message: /Invalid hex string/
        },
        `Should throw for input: ${input}`
      );
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
      assert.doesNotThrow(
        () => toBytes32(input),
        `Should not throw for input: ${input}`
      );
      const result = toBytes32(input);
      assert.ok(result.startsWith('0x'), `Result should start with 0x: ${result}`);
      assert.strictEqual(result.length, 66, `Result length should be 66 (0x + 64 chars): ${result}`);
    }
  });

  it('should accept strings without 0x prefix (treated as utf8)', () => {
    // These are treated as raw strings to be encoded, not hex strings
    // So they should NOT throw "Invalid hex string" even if they contain non-hex chars
    const rawStrings = [
      'hello world',
      'ZZ',
      '123G',
    ];

    for (const input of rawStrings) {
      assert.doesNotThrow(
        () => toBytes32(input),
        `Should not throw for raw string: ${input}`
      );
      const result = toBytes32(input);
      assert.ok(result.startsWith('0x'), `Result should start with 0x: ${result}`);
      assert.strictEqual(result.length, 66, `Result length should be 66: ${result}`);
    }
  });
});
