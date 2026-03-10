import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { formatBps, getBaseScanUrl, calculateDDR, calculateLPP, calculateFeeSplit, calculateExpiresAt, formatDuration } from '../src/utils/index';

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
});
