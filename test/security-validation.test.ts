import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { formatBps, getBaseScanUrl, calculateDDR, calculateLPP, calculateFeeSplit } from '../src/utils/index';

describe('Security Validation across utils', () => {
  it('formatBps should handle NaN and Infinity securely', () => {
    assert.throws(() => formatBps(NaN));
    assert.throws(() => formatBps(Infinity));
  });
});
