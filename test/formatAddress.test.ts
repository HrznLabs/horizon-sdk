import { describe, it } from 'node:test';
import assert from 'node:assert';
import { formatAddress } from '../src/utils/index';

describe('formatAddress Security', () => {
  it('should throw if address is too long', () => {
    const longAddress = 'a'.repeat(300);
    assert.throws(() => formatAddress(longAddress), /exceeds maximum input length/i);
  });
});
