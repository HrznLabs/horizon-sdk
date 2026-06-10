
import { describe, it, expect } from 'vitest';
import { formatBps } from '../src/utils/index';

describe('formatBps UX Improvements', () => {
  it('should format standard basis points', () => {
    expect(formatBps(150)).toBe('1.5%');
    expect(formatBps(400)).toBe('4%');
    expect(formatBps(100)).toBe('1%');
    expect(formatBps(30)).toBe('0.3%');
    expect(formatBps(5)).toBe('0.05%');
  });

  it('should handle zero', () => {
    expect(formatBps(0)).toBe('0%');
  });

  it('should handle negative numbers', () => {
    expect(formatBps(-150)).toBe('-1.5%');
    expect(formatBps(-100)).toBe('-1%');
    expect(formatBps(-5)).toBe('-0.05%');
  });

  it('should respect minDecimals option', () => {
    expect(formatBps(150, { minDecimals: 2 })).toBe('1.50%');
    expect(formatBps(100, { minDecimals: 2 })).toBe('1.00%');
    expect(formatBps(0, { minDecimals: 2 })).toBe('0.00%');
    expect(formatBps(5, { minDecimals: 2 })).toBe('0.05%');
  });

  it('should handle prefix option', () => {
    expect(formatBps(150, { prefix: '+' })).toBe('+1.5%');
    expect(formatBps(-150, { prefix: '$' })).toBe('-$1.5%');
  });

  it('should handle suffix option', () => {
    expect(formatBps(150, { suffix: ' percent' })).toBe('1.5 percent');
    expect(formatBps(100, { suffix: '' })).toBe('1');
  });

  it('should combine options', () => {
    expect(formatBps(150, { minDecimals: 2, prefix: '+', suffix: '' })).toBe('+1.50');
  });

  it('should handle minDecimals > 2 (padding)', () => {
    expect(formatBps(150, { minDecimals: 3 })).toBe('1.500%');
  });

  it('should handle fractional basis points (floats)', () => {
    expect(formatBps(150.5)).toBe('1.505%');
    expect(formatBps(33.33)).toBe('0.3333%');
    expect(formatBps(0.5)).toBe('0.005%');
  });

  it('should handle fractional basis points with minDecimals', () => {
    expect(formatBps(150.5, { minDecimals: 2 })).toBe('1.505%');
    expect(formatBps(150.5, { minDecimals: 4 })).toBe('1.5050%');
  });

  it('should throw error for non-finite basis points', () => {
    expect(() => formatBps(NaN)).toThrow(/Basis points must be a finite number/);
    expect(() => formatBps(Infinity)).toThrow(/Basis points must be a finite number/);
    expect(() => formatBps(-Infinity)).toThrow(/Basis points must be a finite number/);
  });

  it('should handle showPlusSign option correctly', () => {
    expect(formatBps(150, { showPlusSign: true })).toBe('+1.5%');
    expect(formatBps(-150, { showPlusSign: true })).toBe('-1.5%');
    expect(formatBps(0, { showPlusSign: true })).toBe('0%');
    expect(formatBps(150, { prefix: '$', showPlusSign: true, suffix: '' })).toBe('+$1.5');
  });
});
