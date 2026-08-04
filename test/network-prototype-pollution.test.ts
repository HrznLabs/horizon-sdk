import { describe, it, expect } from 'vitest';
import { getNetwork } from '../src';

describe('Network Prototype Pollution Security', () => {
  it('should not allow prototype pollution via chainId', () => {
    // @ts-ignore - purposefully passing string to test runtime behavior
    expect(getNetwork('__proto__')).toBeUndefined();
    // @ts-ignore
    expect(getNetwork('toString')).toBeUndefined();
  });
});
