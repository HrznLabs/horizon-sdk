
import { describe, it, expect } from 'vitest';
import { formatUSDC, formatBps, formatAddress, getBaseScanUrl, calculateDDR, calculateLPP, calculateFeeSplit, calculateExpiresAt, formatDuration, isMissionExpired } from '../src/utils/index';

describe('Security Validation across utils', () => {
  it('formatBps should handle NaN and Infinity securely', () => {
    expect(() => formatBps(NaN)).toThrow();
    expect(() => formatBps(Infinity)).toThrow();
  });

  it('formatUSDC should handle overly long options securely', () => {
    const longString = 'a'.repeat(257);
    expect(() => formatUSDC(100n, { prefix: longString })).toThrow('Prefix too long: exceeds maximum length');
    expect(() => formatUSDC(100n, { suffix: longString })).toThrow('Suffix too long: exceeds maximum length');
  });

  it('formatBps should handle overly long options securely', () => {
    const longString = 'a'.repeat(257);
    expect(() => formatBps(100, { prefix: longString })).toThrow('Prefix too long: exceeds maximum length');
    expect(() => formatBps(100, { suffix: longString })).toThrow('Suffix too long: exceeds maximum length');
  });

  it('formatAddress should handle overly long options securely', () => {
    const longString = 'a'.repeat(257);
    expect(() => formatAddress('0x' + '1'.repeat(40), { separator: longString })).toThrow('Separator too long: exceeds maximum length');
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
