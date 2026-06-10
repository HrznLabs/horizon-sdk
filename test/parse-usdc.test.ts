

import { describe, it, expect } from 'vitest';
import { parseUSDC } from '../src/utils/index';

describe('parseUSDC Security Checks', () => {
  it('should parse valid string amounts correctly', () => {
    expect(parseUSDC('1')).toBe(1000000n);
    expect(parseUSDC('1.5')).toBe(1500000n);
    expect(parseUSDC('0.000001')).toBe(1n);
    expect(parseUSDC('0')).toBe(0n);
  });

  it('should handle large numbers correctly without precision loss', () => {
    const largeStr = '9007199254740993';
    expect(parseUSDC(largeStr)).toBe(9007199254740993000000n);
  });

  it('should handle negative numbers correctly', () => {
    expect(parseUSDC('-10')).toBe(-10000000n);
    expect(parseUSDC('-10.5')).toBe(-10500000n);
    expect(parseUSDC('-0.5')).toBe(-500000n);
  });

  it('should throw error for invalid characters', () => {
    expect(() => parseUSDC('10abc')).toThrow(/Invalid character found/);
  });

  it('should throw error for too many decimals', () => {
    expect(() => parseUSDC('1.1234567')).toThrow(/Too many decimals/);
  });

  it('should throw error for multiple decimal points', () => {
    expect(() => parseUSDC('1.2.3')).toThrow(/Multiple decimal points found/);
  });

  it('should throw specific error for commas', () => {
    expect(() => parseUSDC('1,000')).toThrow(/Commas are not allowed/);
  });

  it('should throw specific error for currency symbols', () => {
    expect(() => parseUSDC('$100')).toThrow(/Currency symbols are not allowed/);
  });

  it('should throw specific error for spaces', () => {
    expect(() => parseUSDC('100 00')).toThrow(/Spaces are not allowed/);
  });

  it('should throw error for numbers with too many decimals', () => {
    expect(() => parseUSDC(1.1234569)).toThrow(/Too many decimals/);
  });

  it('should throw error for scientific notation (unsafe or non-standard)', () => {
    expect(() => parseUSDC(1e-7)).toThrow(/Invalid character found/);
  });

  it('should accept safe numbers', () => {
    expect(parseUSDC(1.5)).toBe(1500000n);
    expect(parseUSDC(100)).toBe(100000000n);
    expect(parseUSDC(0.57)).toBe(570000n);
  });
});
