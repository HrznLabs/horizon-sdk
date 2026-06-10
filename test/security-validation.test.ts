
import { describe, it, expect } from 'vitest';
import { formatBps, calculateExpiresAt, formatDuration } from '../src/utils/index';

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
});
