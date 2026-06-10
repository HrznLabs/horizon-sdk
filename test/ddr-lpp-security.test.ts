

import { describe, it, expect } from 'vitest';
import { calculateDDR, calculateLPP } from '../src/utils/index';

describe('DDR and LPP Security Checks', () => {
  it('should throw error if rewardAmount is negative', () => {
    const negativeReward = -1000000n;

    expect(() => {
      calculateDDR(negativeReward);
    }).toThrow(/Reward amount must be non-negative/);

    expect(() => {
      calculateLPP(negativeReward);
    }).toThrow(/Reward amount must be non-negative/);
  });

  it('should calculate correctly for valid inputs', () => {
    const reward = BigInt(10000); // 10000 units
    // DDR is 5% = 500
    // LPP is 2% = 200
    expect(calculateDDR(reward)).toBe(500n);
    expect(calculateLPP(reward)).toBe(200n);
  });
});
