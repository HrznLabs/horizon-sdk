
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { formatUSDC, formatBps } from '../src/utils/index';

describe('Formatting Utilities DoS Protection', () => {
  it('formatBps should throw specific error for minDecimals > 100', () => {
    assert.throws(() => {
      formatBps(100, { minDecimals: 101 });
    }, /minDecimals must be between 0 and 100/);
  });

  it('formatUSDC should throw specific error for minDecimals > 100', () => {
    assert.throws(() => {
      formatUSDC(1000000n, { minDecimals: 101 });
    }, /minDecimals must be between 0 and 100/);
  });

  it('formatBps should throw specific error for negative minDecimals', () => {
    assert.throws(() => {
      formatBps(100, { minDecimals: -1 });
    }, /minDecimals must be between 0 and 100/);
  });

  it('formatUSDC should throw specific error for negative minDecimals', () => {
    assert.throws(() => {
      formatUSDC(1000000n, { minDecimals: -1 });
    }, /minDecimals must be between 0 and 100/);
  });
});
