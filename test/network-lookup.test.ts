import { describe, it, expect } from 'vitest';
import { getNetwork, getContracts, NETWORKS } from '../src/constants';

describe('getNetwork prototype-chain safety', () => {
  it('returns config for a real chain id', () => {
    const ids = Object.keys(NETWORKS).map(Number);
    expect(ids.length).toBeGreaterThan(0);
    expect(getNetwork(ids[0])).toBeDefined();
  });

  it('returns undefined for unknown chain ids', () => {
    expect(getNetwork(999999)).toBeUndefined();
  });

  // JS consumers of the published package are not bound by the `number` type.
  it.each(['__proto__', 'constructor', 'toString', 'hasOwnProperty'])(
    'returns undefined for inherited key %s',
    key => {
      expect(getNetwork(key as unknown as number)).toBeUndefined();
      expect(getContracts(key as unknown as number)).toBeUndefined();
    }
  );

  it('does not leak Object.prototype', () => {
    expect(getNetwork('__proto__' as unknown as number)).not.toBe(Object.prototype);
  });
});
