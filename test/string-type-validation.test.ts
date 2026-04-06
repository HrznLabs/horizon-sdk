import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { parseUSDC, toBytes32, getBaseScanUrl } from '../src/utils/index';

describe('String Type Validation', () => {
  it('should throw Error instead of TypeError when passed non-strings', () => {
    assert.throws(() => parseUSDC(null as any), { message: 'Invalid USDC amount format' });
    assert.throws(() => parseUSDC({} as any), { message: 'Invalid USDC amount format' });

    assert.throws(() => toBytes32(null as any), { message: 'Input must be a string' });
    assert.throws(() => toBytes32(123 as any), { message: 'Input must be a string' });

    assert.throws(() => getBaseScanUrl(null as any), { message: 'Invalid address or transaction hash.' });
    assert.throws(() => getBaseScanUrl(123 as any), { message: 'Invalid address or transaction hash.' });
  });
});
