
import { describe, it, expect } from 'vitest';
import { formatUSDC } from '../src/utils/index';
import { USDC_DECIMALS } from '../src/constants';

describe('formatUSDC', () => {
  it('should format simple amounts', () => {
    expect(formatUSDC(1000000n)).toBe('1');
    expect(formatUSDC(10000000n)).toBe('10');
  });

  it('should format amounts with commas', () => {
    expect(formatUSDC(1000000000n)).toBe('1,000');
    expect(formatUSDC(1000000000000n)).toBe('1,000,000');
  });

  it('should format small amounts correctly', () => {
    expect(formatUSDC(500000n)).toBe('0.5');
  });

  it('should handle zero', () => {
    expect(formatUSDC(0n)).toBe('0');
  });
});
