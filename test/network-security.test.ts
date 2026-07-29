import { describe, it, expect } from 'vitest';
import { getNetwork, getContracts } from '../src/constants';

describe('Network Config Security Validation', () => {
  it('getNetwork should not return prototype properties for invalid chainIds', () => {
    expect(getNetwork('__proto__' as any)).toBeUndefined();
    expect(getNetwork('toString' as any)).toBeUndefined();
    expect(getNetwork('constructor' as any)).toBeUndefined();
  });

  it('getContracts should not return prototype properties for invalid chainIds', () => {
    expect(getContracts('__proto__' as any)).toBeUndefined();
    expect(getContracts('toString' as any)).toBeUndefined();
    expect(getContracts('constructor' as any)).toBeUndefined();
  });
});
