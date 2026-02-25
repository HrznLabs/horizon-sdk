import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { getBaseScanUrl } from '../src/utils/index';

describe('getBaseScanUrl', () => {
  const address = '0x1234567890123456789012345678901234567890'; // 42 chars
  const txHash = '0x1234567890123456789012345678901234567890123456789012345678901234'; // 66 chars

  it('should generate address URL by default for addresses', () => {
    const expected = `https://sepolia.basescan.org/address/${address}`;
    assert.strictEqual(getBaseScanUrl(address), expected);
  });

  it('should generate tx URL by default for tx hashes', () => {
    const expected = `https://sepolia.basescan.org/tx/${txHash}`;
    // This expects the NEW behavior (smart detection)
    assert.strictEqual(getBaseScanUrl(txHash), expected);
  });

  it('should allow overriding type', () => {
    // Force address type for tx hash (weird case but possible)
    const expected = `https://sepolia.basescan.org/address/${txHash}`;
    assert.strictEqual(getBaseScanUrl(txHash, 'address'), expected);
  });

  it('should use mainnet URL when testnet is false', () => {
    const expected = `https://basescan.org/address/${address}`;
    assert.strictEqual(getBaseScanUrl(address, undefined, false), expected);
  });

  it('should throw error for invalid short strings', () => {
    const short = 'Alice';
    assert.throws(() => getBaseScanUrl(short), { message: 'Invalid address or transaction hash.' });
  });

  it('should throw error for XSS payload', () => {
    const xss = '<script>alert(1)</script>';
    assert.throws(() => getBaseScanUrl(xss), { message: 'Invalid address or transaction hash.' });
  });

  it('should throw error for path traversal', () => {
    const path = '../../evil';
    assert.throws(() => getBaseScanUrl(path), { message: 'Invalid address or transaction hash.' });
  });

  it('should throw error for invalid hex length', () => {
    const weird = '0x12345';
    assert.throws(() => getBaseScanUrl(weird), { message: 'Invalid address or transaction hash.' });
  });

  it('should throw error for non-hex characters', () => {
    const badHex = '0xZZZ4567890123456789012345678901234567890';
    assert.throws(() => getBaseScanUrl(badHex), { message: 'Invalid address or transaction hash.' });
  });
});
