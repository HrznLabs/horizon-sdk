
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getBaseScanUrl } from '../src/utils/index';

describe('getBaseScanUrl Performance', () => {
  it('should fail fast on huge inputs', () => {
    // 10MB string
    const hugeString = '0x' + '0'.repeat(10 * 1024 * 1024);

    const start = performance.now();
    try {
      getBaseScanUrl(hugeString);
    } catch (e) {
      // expected
    }
    const end = performance.now();

    console.log(`Time taken: ${end - start}ms`);
    // Should be very fast (< 10ms)
    assert.ok((end - start) < 50, 'Validation took too long');
  });
});
