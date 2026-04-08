import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { formatBps, getBaseScanUrl, calculateDDR, calculateLPP, calculateFeeSplit, calculateExpiresAt, formatDuration, isMissionExpired } from '../src/utils/index';

describe('Security Validation across utils', () => {
  it('formatBps should handle NaN and Infinity securely', () => {
    assert.throws(() => formatBps(NaN));
    assert.throws(() => formatBps(Infinity));
  });

  it('calculateExpiresAt should handle NaN and Infinity securely', () => {
    assert.throws(() => calculateExpiresAt(NaN));
    assert.throws(() => calculateExpiresAt(Infinity));
  });

  it('formatDuration should handle NaN and Infinity securely', () => {
    assert.throws(() => formatDuration(NaN));
    assert.throws(() => formatDuration(Infinity));
  });

  it('calculateDDR, calculateLPP, calculateFeeSplit, and isMissionExpired should fail securely for invalid types', () => {
    assert.throws(() => calculateDDR('100' as any), { message: 'Reward amount must be a bigint' });
    assert.throws(() => calculateLPP('100' as any), { message: 'Reward amount must be a bigint' });
    assert.throws(() => calculateFeeSplit('100' as any, 100), { message: 'Reward amount must be a bigint' });
    assert.throws(() => isMissionExpired('100' as any), { message: 'Expiration timestamp must be a bigint' });
  });
});
