import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateExpiresAt } from '../src/utils/index';
import { MIN_DURATION, MAX_DURATION } from '../src/constants';

describe('calculateExpiresAt Security Checks', () => {
  it('should calculate correctly for valid duration (MIN_DURATION)', () => {
    const before = BigInt(Math.floor(Date.now() / 1000));
    const expiresAt = calculateExpiresAt(MIN_DURATION);
    const after = BigInt(Math.floor(Date.now() / 1000));

    // Check that expiresAt is between (before + duration) and (after + duration)
    assert.ok(expiresAt >= before + BigInt(MIN_DURATION));
    assert.ok(expiresAt <= after + BigInt(MIN_DURATION));
  });

  it('should calculate correctly for valid duration (MAX_DURATION)', () => {
    const before = BigInt(Math.floor(Date.now() / 1000));
    const expiresAt = calculateExpiresAt(MAX_DURATION);
    const after = BigInt(Math.floor(Date.now() / 1000));

    assert.ok(expiresAt >= before + BigInt(MAX_DURATION));
    assert.ok(expiresAt <= after + BigInt(MAX_DURATION));
  });

  it('should throw error if duration is less than MIN_DURATION', () => {
    assert.throws(() => {
      calculateExpiresAt(MIN_DURATION - 1);
    }, /Duration must be between/);
  });

  it('should throw error if duration is greater than MAX_DURATION', () => {
    assert.throws(() => {
      calculateExpiresAt(MAX_DURATION + 1);
    }, /Duration must be between/);
  });

  it('should throw error if duration is negative', () => {
    assert.throws(() => {
      calculateExpiresAt(-1);
    }, /Duration must be between/);
  });

  it('should throw error if duration is not an integer', () => {
     assert.throws(() => {
       calculateExpiresAt(MIN_DURATION + 0.5);
     }, /Duration must be an integer/);
  });
});
