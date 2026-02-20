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

  it('should handle short strings gracefully', () => {
    const short = 'Alice';
    const expected = `https://sepolia.basescan.org/address/${short}`;
    assert.strictEqual(getBaseScanUrl(short), expected);
  });
});
