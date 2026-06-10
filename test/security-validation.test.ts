
import { describe, it, expect } from 'vitest';
import { formatBps, getBaseScanUrl, calculateDDR, calculateLPP, calculateFeeSplit, calculateExpiresAt, formatDuration, isMissionExpired } from '../src/utils/index';

describe('Security Validation across utils', () => {
  it('formatBps should handle NaN and Infinity securely', () => {
    expect(() => formatBps(NaN)).toThrow();
    expect(() => formatBps(Infinity)).toThrow();
  });

  it('calculateExpiresAt should handle NaN and Infinity securely', () => {
    expect(() => calculateExpiresAt(NaN)).toThrow();
    expect(() => calculateExpiresAt(Infinity)).toThrow();
  });

  it('formatDuration should handle NaN and Infinity securely', () => {
    expect(() => formatDuration(NaN)).toThrow();
    expect(() => formatDuration(Infinity)).toThrow();
  });

  it('calculateDDR, calculateLPP, calculateFeeSplit, and isMissionExpired should fail securely for invalid types', () => {
    expect(() => calculateDDR('100' as any)).toThrow('Reward amount must be a bigint');
    expect(() => calculateLPP('100' as any)).toThrow('Reward amount must be a bigint');
    expect(() => calculateFeeSplit('100' as any, 100)).toThrow('Reward amount must be a bigint');
    expect(() => isMissionExpired('100' as any)).toThrow('Expiration timestamp must be a bigint');
  });
});
