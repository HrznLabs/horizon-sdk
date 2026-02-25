import { describe, it } from 'node:test';
import assert from 'node:assert';
import { formatDuration } from '../src/utils/index';

describe('formatDuration', () => {
  it('should format simple durations', () => {
    assert.strictEqual(formatDuration(3600), '1 hour');
    assert.strictEqual(formatDuration(7200), '2 hours');
    assert.strictEqual(formatDuration(86400), '1 day');
  });

  it('should handle zero', () => {
    assert.strictEqual(formatDuration(0), '0 seconds');
  });

  it('should handle negative numbers', () => {
    assert.strictEqual(formatDuration(-3600), '1 hour');
  });

  it('should format multiple parts', () => {
    assert.strictEqual(formatDuration(90000), '1 day 1 hour');
    assert.strictEqual(formatDuration(3660), '1 hour 1 minute');
  });

  it('should support short format', () => {
    assert.strictEqual(formatDuration(3600, { short: true }), '1h');
    assert.strictEqual(formatDuration(90000, { short: true }), '1d 1h');
    assert.strictEqual(formatDuration(0, { short: true }), '0s');
  });

  it('should respect maxParts', () => {
    // 1 day 1 hour 1 minute -> 90060
    assert.strictEqual(formatDuration(90060, { maxParts: 3 }), '1 day 1 hour 1 minute');
    assert.strictEqual(formatDuration(90060, { maxParts: 2 }), '1 day 1 hour');
    assert.strictEqual(formatDuration(90060, { maxParts: 1 }), '1 day');
  });
});
