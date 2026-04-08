import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { parseUSDC, toBytes32, getBaseScanUrl, formatAddress, formatUSDC } from '../src/utils/index';

describe('Security Type Validation', () => {
  it('parseUSDC should throw for invalid types', () => {
    assert.throws(() => parseUSDC(null as any), /Invalid USDC amount format/);
  });
  it('formatUSDC should throw for invalid types', () => {
    assert.throws(() => formatUSDC(null as any), /Amount must be a bigint/);
  });
  it('toBytes32 should throw for invalid types', () => {
    assert.throws(() => toBytes32(null as any), /Input must be a string/);
  });
  it('getBaseScanUrl should throw for invalid types', () => {
    assert.throws(() => getBaseScanUrl(null as any), /Invalid address or transaction hash./);
  });
});
