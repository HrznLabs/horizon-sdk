
import { describe, it, expect } from 'vitest';
import { getBaseScanUrl } from '../src/utils/index';

describe('getBaseScanUrl', () => {
  const address = '0x1234567890123456789012345678901234567890'; // 42 chars
  const txHash = '0x1234567890123456789012345678901234567890123456789012345678901234'; // 66 chars

  it('should generate address URL by default for addresses', () => {
    const expected = `https://sepolia.basescan.org/address/${address}`;
    expect(getBaseScanUrl(address)).toBe(expected);
  });

  it('should generate tx URL by default for tx hashes', () => {
    const expected = `https://sepolia.basescan.org/tx/${txHash}`;
    expect(getBaseScanUrl(txHash)).toBe(expected);
  });

  it('should use mainnet URL when testnet is false', () => {
    const expected = `https://basescan.org/address/${address}`;
    expect(getBaseScanUrl(address, undefined, false)).toBe(expected);
  });

  it('should throw error for invalid short strings', () => {
    const short = 'Alice';
    expect(() => getBaseScanUrl(short)).toThrow(/Invalid address or transaction hash/);
  });

  it('should throw error for XSS payload', () => {
    const xss = '<script>alert(1)</script>';
    expect(() => getBaseScanUrl(xss)).toThrow(/Invalid address or transaction hash/);
  });

  it('should throw error for path traversal', () => {
    const path = '../../evil';
    expect(() => getBaseScanUrl(path)).toThrow(/Invalid address or transaction hash/);
  });

  it('should throw error for invalid hex length', () => {
    const weird = '0x12345';
    expect(() => getBaseScanUrl(weird)).toThrow(/Invalid address or transaction hash/);
  });

  it('should throw error for non-hex characters', () => {
    const badHex = '0xZZZ4567890123456789012345678901234567890';
    expect(() => getBaseScanUrl(badHex)).toThrow(/Invalid address or transaction hash/);
  });

  it('should throw error for invalid type', () => {
    expect(() => getBaseScanUrl(address, 'address/../../evil' as any)).toThrow(/Invalid type/);
    expect(() => getBaseScanUrl(address, 'invalid_type' as any)).toThrow(/Invalid type/);
  });
});
