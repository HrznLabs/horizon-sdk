import { describe, it, expect } from 'vitest';
import { parseUSDC } from '../src/utils/index';

describe('parseUSDC Precision Protection', () => {
  it('should throw error when passed a number exceeding MAX_SAFE_INTEGER', () => {
    expect(() => parseUSDC(Number.MAX_SAFE_INTEGER + 4)).toThrow(/Number exceeds safe integer limits/);
  });

  it('should throw error when passed a number less than MIN_SAFE_INTEGER', () => {
    expect(() => parseUSDC(Number.MIN_SAFE_INTEGER - 4)).toThrow(/Number exceeds safe integer limits/);
  });

  it('should accept numbers within safe integer limits', () => {
    expect(() => {
      parseUSDC(Number.MAX_SAFE_INTEGER);
      parseUSDC(Number.MIN_SAFE_INTEGER);
    }).not.toThrow();
  });
});
