import { describe, it, expect } from 'vitest';
import { parseUSDC, toBytes32, getBaseScanUrl, formatAddress, formatUSDC } from '../src/utils/index';

describe('Security Type Validation', () => {
  it('parseUSDC should throw for invalid types', () => {
    expect(() => parseUSDC(null as any)).toThrow(/Invalid USDC amount format/);
  });
  it('formatUSDC should throw for invalid types', () => {
    expect(() => formatUSDC(null as any)).toThrow(/Amount must be a bigint/);
  });
  it('toBytes32 should throw for invalid types', () => {
    expect(() => toBytes32(null as any)).toThrow(/Input must be a string/);
  });
  it('getBaseScanUrl should throw for invalid types', () => {
    expect(() => getBaseScanUrl(null as any)).toThrow(/Invalid address or transaction hash./);
  });
});
