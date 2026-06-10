

import { describe, it, expect } from 'vitest';
import { calculateFeeSplit } from '../src/utils/index';
import { FEES } from '../src/constants';

describe('calculateFeeSplit Security Checks', () => {
  it('should throw error if guildFeeBps exceeds MAX_GUILD_BPS', () => {
    const invalidFee = FEES.MAX_GUILD_BPS + 1;
    expect(() => {
      calculateFeeSplit(BigInt(1000), invalidFee);
    }).toThrow(/Guild fee must be between 0 and 1500 bps/);
  });

  it('should throw error if guildFeeBps is negative', () => {
    expect(() => {
      calculateFeeSplit(BigInt(1000), -1);
    }).toThrow(/Guild fee must be between 0 and 1500 bps/);
  });

  it('should throw error if guildFeeBps is not an integer', () => {
    expect(() => {
      calculateFeeSplit(BigInt(1000), 10.5);
    }).toThrow(/Guild fee must be an integer/);
  });

  it('should throw error if rewardAmount is negative', () => {
    expect(() => {
      calculateFeeSplit(-100n, 0);
    }).toThrow(/Reward amount must be non-negative/);
  });

  it('should calculate correctly for valid inputs', () => {
    const reward = BigInt(10000); // 10000 units
    // fees: P=250, L=250, R=200, G=300 (3%)
    // Total fees: 1000/10000 = 10%
    // 10% of 10000 = 1000
    // Performer: 10000 - 1000 = 9000
    const split = calculateFeeSplit(reward, 300);
    expect(split.protocolAmount).toBe(250n);
    expect(split.labsAmount).toBe(250n);
    expect(split.resolverAmount).toBe(200n);
    expect(split.guildAmount).toBe(300n);
    expect(split.performerAmount).toBe(9000n);
  });
});
