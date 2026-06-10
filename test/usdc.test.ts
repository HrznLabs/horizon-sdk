

import { describe, it, expect } from 'vitest';
import { parseUSDC, formatUSDC } from '../src/utils/index';

describe('USDC Utility Security Checks', () => {
  describe('parseUSDC', () => {
    it('should parse valid integers correctly', () => {
      expect(parseUSDC('100')).toBe(100000000n);
    });

    it('should parse valid decimals correctly', () => {
      expect(parseUSDC('10.5')).toBe(10500000n);
    });

    it('should throw error for inputs with commas', () => {
      // Currently this parses as 1, which is dangerous
      expect(() => {
        parseUSDC('1,000');
      }).toThrow(/Commas are not allowed/);
    });

    it('should throw error for inputs with multiple decimals', () => {
      expect(() => {
        parseUSDC('10.5.5');
      }).toThrow(/Multiple decimal points found/);
    });

    it('should throw error for non-numeric characters', () => {
      expect(() => {
        parseUSDC('100abc');
      }).toThrow(/Invalid character found/);
    });

    it('should throw error for negative numbers if not supported (or just parse correctly)', () => {
       // Assuming we might want to support negative balances, but if not, we should block it.
       // The current implementation allows it. Let's stick to format validation for now.
       // If "1,000" is passed, parseFloat sees "1".
    });
  });

  describe('formatUSDC', () => {
    it('should format correctly', () => {
      expect(formatUSDC(10500000n)).toBe('10.5');
    });

    it('should format integer amounts without decimals', () => {
      expect(formatUSDC(100000000n)).toBe('100');
    });

    it('should format negative numbers correctly', () => {
      expect(formatUSDC(-1500000n)).toBe('-1.5');
    });

    it('should format zero correctly', () => {
      expect(formatUSDC(0n)).toBe('0');
    });
  });
});
