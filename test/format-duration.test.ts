
import { describe, it, expect } from 'vitest';
import { formatDuration } from '../src/utils/index';

describe('formatDuration', () => {
  it('should format seconds correctly in short style', () => {
    expect(formatDuration(3600)).toBe('1h');
    expect(formatDuration(60)).toBe('1m');
    expect(formatDuration(1)).toBe('1s');
    expect(formatDuration(86400)).toBe('1d');
  });

  it('should format mixed units correctly in short style', () => {
    expect(formatDuration(3660)).toBe('1h 1m');
    expect(formatDuration(90)).toBe('1m 30s');
    expect(formatDuration(86400 + 3600 + 60 + 1)).toBe('1d 1h 1m 1s');
  });

  it('should format seconds correctly in long style', () => {
    expect(formatDuration(3600, { style: 'long' })).toBe('1 hour');
    expect(formatDuration(60, { style: 'long' })).toBe('1 minute');
    expect(formatDuration(1, { style: 'long' })).toBe('1 second');
    expect(formatDuration(86400, { style: 'long' })).toBe('1 day');
  });

  it('should format mixed units correctly in long style', () => {
    expect(formatDuration(3660, { style: 'long' })).toBe('1 hour 1 minute');
    expect(formatDuration(90, { style: 'long' })).toBe('1 minute 30 seconds');
    expect(formatDuration(7322, { style: 'long' })).toBe('2 hours 2 minutes 2 seconds');
  });

  it('should format zero correctly', () => {
    expect(formatDuration(0)).toBe('0s');
    expect(formatDuration(0, { style: 'long' })).toBe('0 seconds');
  });

  it('should format large durations correctly', () => {
    expect(formatDuration(2592000)).toBe('30d');
    expect(formatDuration(2592000, { style: 'long' })).toBe('30 days');
  });

  it('should respect maxParts option', () => {
    const duration = 86400 + 3600 + 60 + 1; // 1d 1h 1m 1s
    expect(formatDuration(duration, { maxParts: 1 })).toBe('1d');
    expect(formatDuration(duration, { maxParts: 2 })).toBe('1d 1h');
    expect(formatDuration(duration, { maxParts: 3 })).toBe('1d 1h 1m');
    expect(formatDuration(duration, { maxParts: 4 })).toBe('1d 1h 1m 1s');

    // With long style
    expect(formatDuration(duration, { style: 'long', maxParts: 2 })).toBe('1 day 1 hour');

    // When remaining seconds reach 0 before maxParts is hit
    expect(formatDuration(3600, { maxParts: 3 })).toBe('1h');
  });

  it('should handle singular vs plural correctly in long style', () => {
    expect(formatDuration(1, { style: 'long' })).toBe('1 second');
    expect(formatDuration(2, { style: 'long' })).toBe('2 seconds');
    expect(formatDuration(3600, { style: 'long' })).toBe('1 hour');
    expect(formatDuration(7200, { style: 'long' })).toBe('2 hours');
  });

  it('should handle negative duration by gracefully prepending minus sign', () => {
    expect(formatDuration(-3600)).toBe('-1h');
    expect(formatDuration(-3660, { style: 'long' })).toBe('-1 hour 1 minute');
  });

  it('should throw error for non-integer duration', () => {
    expect(() => formatDuration(1.5)).toThrow(/Duration must be an integer/);
  });

  it('should throw error for non-finite duration', () => {
    expect(() => formatDuration(NaN)).toThrow(/Duration must be a finite number/);
    expect(() => formatDuration(Infinity)).toThrow(/Duration must be a finite number/);
    expect(() => formatDuration(-Infinity)).toThrow(/Duration must be a finite number/);
  });
});
