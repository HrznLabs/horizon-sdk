
import { describe, it, expect } from 'vitest';
import { formatBps } from '../src/utils/index';

describe('formatBps validation', () => {
  it('should throw error for non-finite inputs', () => {
    expect(() => formatBps(NaN)).toThrow();
    expect(() => formatBps(Infinity)).toThrow();
    expect(() => formatBps(-Infinity)).toThrow();
  });
});
