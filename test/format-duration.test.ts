import { describe, it } from 'node:test';
import assert from 'node:assert';
import { formatDuration } from '../src/utils/index';

describe('formatDuration', () => {
  it('should format seconds correctly in short style', () => {
    assert.strictEqual(formatDuration(3600), '1h');
    assert.strictEqual(formatDuration(60), '1m');
    assert.strictEqual(formatDuration(1), '1s');
    assert.strictEqual(formatDuration(86400), '1d');
  });

  it('should format mixed units correctly in short style', () => {
    assert.strictEqual(formatDuration(3660), '1h 1m');
    assert.strictEqual(formatDuration(90), '1m 30s');
    assert.strictEqual(formatDuration(86400 + 3600 + 60 + 1), '1d 1h 1m 1s');
  });

  it('should format seconds correctly in long style', () => {
    assert.strictEqual(formatDuration(3600, { style: 'long' }), '1 hour');
    assert.strictEqual(formatDuration(60, { style: 'long' }), '1 minute');
    assert.strictEqual(formatDuration(1, { style: 'long' }), '1 second');
    assert.strictEqual(formatDuration(86400, { style: 'long' }), '1 day');
  });

  it('should format mixed units correctly in long style', () => {
    assert.strictEqual(formatDuration(3660, { style: 'long' }), '1 hour 1 minute');
    assert.strictEqual(formatDuration(90, { style: 'long' }), '1 minute 30 seconds');
    assert.strictEqual(formatDuration(7322, { style: 'long' }), '2 hours 2 minutes 2 seconds');
  });

  it('should format zero correctly', () => {
    assert.strictEqual(formatDuration(0), '0s');
    assert.strictEqual(formatDuration(0, { style: 'long' }), '0 seconds');
  });

  it('should format large durations correctly', () => {
    // 30 days
    assert.strictEqual(formatDuration(2592000), '30d');
    assert.strictEqual(formatDuration(2592000, { style: 'long' }), '30 days');
  });

  it('should handle singular vs plural correctly in long style', () => {
    assert.strictEqual(formatDuration(1, { style: 'long' }), '1 second');
    assert.strictEqual(formatDuration(2, { style: 'long' }), '2 seconds');
    assert.strictEqual(formatDuration(3600, { style: 'long' }), '1 hour');
    assert.strictEqual(formatDuration(7200, { style: 'long' }), '2 hours');
  });

  it('should throw error for negative duration', () => {
    assert.throws(() => formatDuration(-1), /Duration must be non-negative/);
  });

  it('should throw error for non-integer duration', () => {
    assert.throws(() => formatDuration(1.5), /Duration must be an integer/);
  });
});
