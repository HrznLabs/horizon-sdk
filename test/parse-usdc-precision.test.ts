import { describe, it } from 'node:test';
import assert from 'node:assert';
import { parseUSDC } from '../src/utils/index';

describe('parseUSDC Precision Protection', () => {
  it('should throw error when passed a number exceeding MAX_SAFE_INTEGER', () => {
    assert.throws(() => {
      parseUSDC(Number.MAX_SAFE_INTEGER + 4);
    }, {
      message: /Number exceeds safe integer limits/
    });
  });

  it('should throw error when passed a number less than MIN_SAFE_INTEGER', () => {
    assert.throws(() => {
      parseUSDC(Number.MIN_SAFE_INTEGER - 4);
    }, {
      message: /Number exceeds safe integer limits/
    });
  });

  it('should accept numbers within safe integer limits', () => {
    assert.doesNotThrow(() => {
      parseUSDC(Number.MAX_SAFE_INTEGER);
      parseUSDC(Number.MIN_SAFE_INTEGER);
    });
  });
});
