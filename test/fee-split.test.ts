
import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateFeeSplit } from '../src/utils/index';
import { FEES } from '../src/constants';

describe('calculateFeeSplit Security Checks', () => {
  it('should throw error if guildFeeBps exceeds MAX_GUILD_BPS', () => {
    const invalidFee = FEES.MAX_GUILD_BPS + 1;
    assert.throws(() => {
      calculateFeeSplit(BigInt(1000), invalidFee);
    }, /Guild fee must be between 0 and 1500 bps/);
  });

  it('should throw error if guildFeeBps is negative', () => {
    assert.throws(() => {
      calculateFeeSplit(BigInt(1000), -1);
    }, /Guild fee must be between 0 and 1500 bps/);
  });

  it('should throw error if rewardAmount is negative', () => {
    assert.throws(() => {
      calculateFeeSplit(-100n, 0);
    }, /Reward amount must be non-negative/);
  });

  it('should calculate correctly for valid inputs', () => {
    const reward = BigInt(10000); // 10000 units
    // fees: P=400, L=400, R=200, G=300 (3%)
    // Total fees: 1300/10000 = 13%
    // 13% of 10000 = 1300
    // Performer: 10000 - 1300 = 8700
    const split = calculateFeeSplit(reward, 300);
    assert.strictEqual(split.protocolAmount, 400n);
    assert.strictEqual(split.labsAmount, 400n);
    assert.strictEqual(split.resolverAmount, 200n);
    assert.strictEqual(split.guildAmount, 300n);
    assert.strictEqual(split.performerAmount, 8700n);
  });
});
