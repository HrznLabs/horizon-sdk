
import { describe, it, expect } from 'vitest';
import { calculateExpiresAt } from '../src/utils/index';
import { MIN_DURATION, MAX_DURATION } from '../src/constants';

describe('calculateExpiresAt Security Checks', () => {
  it('should calculate correctly for valid duration (MIN_DURATION)', () => {
    const before = BigInt(Math.floor(Date.now() / 1000));
    const expiresAt = calculateExpiresAt(MIN_DURATION);
    const after = BigInt(Math.floor(Date.now() / 1000));

    expect(expiresAt >= before + BigInt(MIN_DURATION)).toBeTruthy();
    expect(expiresAt <= after + BigInt(MIN_DURATION)).toBeTruthy();
  });

  it('should calculate correctly for valid duration (MAX_DURATION)', () => {
    const before = BigInt(Math.floor(Date.now() / 1000));
    const expiresAt = calculateExpiresAt(MAX_DURATION);
    const after = BigInt(Math.floor(Date.now() / 1000));

    expect(expiresAt >= before + BigInt(MAX_DURATION)).toBeTruthy();
    expect(expiresAt <= after + BigInt(MAX_DURATION)).toBeTruthy();
  });

  it('should throw error if duration is less than MIN_DURATION', () => {
    expect(() => {
      calculateExpiresAt(MIN_DURATION - 1);
    }).toThrow(/Duration must be between/);
  });

  it('should throw error if duration is greater than MAX_DURATION', () => {
    expect(() => {
      calculateExpiresAt(MAX_DURATION + 1);
    }).toThrow(/Duration must be between/);
  });

  it('should throw error if duration is negative', () => {
    expect(() => {
      calculateExpiresAt(-1);
    }).toThrow(/Duration must be between/);
  });

  it('should throw error if duration is not an integer', () => {
    expect(() => {
      calculateExpiresAt(MIN_DURATION + 0.5);
    }).toThrow(/Duration must be an integer/);
  });

  it('should throw error for non-finite duration', () => {
    expect(() => calculateExpiresAt(NaN)).toThrow(/Duration must be a finite number/);
    expect(() => calculateExpiresAt(Infinity)).toThrow(/Duration must be a finite number/);
    expect(() => calculateExpiresAt(-Infinity)).toThrow(/Duration must be a finite number/);
  });
});
