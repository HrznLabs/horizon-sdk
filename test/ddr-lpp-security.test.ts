
import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateDDR, calculateLPP } from '../src/utils/index';

describe('DDR and LPP Security Checks', () => {
  it('should throw error if rewardAmount is negative', () => {
    const negativeReward = -1000000n;

    assert.throws(() => {
      calculateDDR(negativeReward);
    }, /Reward amount must be non-negative/);

    assert.throws(() => {
      calculateLPP(negativeReward);
    }, /Reward amount must be non-negative/);
  });

  it('should calculate correctly for valid inputs', () => {
    const reward = BigInt(10000); // 10000 units
    // DDR is 5% = 500
    // LPP is 2% = 200
    assert.strictEqual(calculateDDR(reward), 500n);
    assert.strictEqual(calculateLPP(reward), 200n);
  });
});
