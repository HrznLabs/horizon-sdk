
import { describe, it, expect } from 'vitest';
import { formatBps, formatUSDC, formatAddress, getBaseScanUrl, calculateDDR, calculateLPP, calculateFeeSplit, calculateExpiresAt, formatDuration, isMissionExpired } from '../src/utils/index';

describe('Security Validation across utils', () => {
  it('formatUSDC, formatBps, and formatAddress should handle unbounded option strings securely', () => {
    const hugeString = 'A'.repeat(257);
    expect(() => formatUSDC(100n, { prefix: hugeString })).toThrow('Prefix too long');
    expect(() => formatUSDC(100n, { suffix: hugeString })).toThrow('Suffix too long');
    expect(() => formatBps(100, { prefix: hugeString })).toThrow('Prefix too long');
    expect(() => formatBps(100, { suffix: hugeString })).toThrow('Suffix too long');
    expect(() => formatAddress('0x1234567890123456789012345678901234567890', { separator: hugeString })).toThrow('Separator too long');
  });

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
