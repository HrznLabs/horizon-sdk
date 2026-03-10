import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { formatBps } from '../src/utils/index';

describe('formatBps validation', () => {
  it('should throw error for non-finite inputs', () => {
    assert.throws(() => formatBps(NaN));
    assert.throws(() => formatBps(Infinity));
    assert.throws(() => formatBps(-Infinity));
  });
});
