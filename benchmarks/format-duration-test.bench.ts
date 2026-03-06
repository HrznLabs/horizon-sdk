import { formatDuration } from '../src/utils/index';

const ITERATIONS = 1_000_000;

const TIME_UNITS_SHORT = [
  { label: 'd', seconds: 86400 },
  { label: 'h', seconds: 3600 },
  { label: 'm', seconds: 60 },
  { label: 's', seconds: 1 },
];

const TIME_UNITS_LONG = [
  { label: 'day', seconds: 86400 },
  { label: 'hour', seconds: 3600 },
  { label: 'minute', seconds: 60 },
  { label: 'second', seconds: 1 },
];

function formatDurationOptimized(
  seconds: number,
  options?: { style?: 'short' | 'long' }
): string {
  if (!Number.isFinite(seconds)) throw new Error('Duration must be a finite number');
  if (seconds < 0) throw new Error('Duration must be non-negative');
  if (!Number.isInteger(seconds)) throw new Error('Duration must be an integer');

  const isLong = options?.style === 'long';
  if (seconds === 0) return isLong ? '0 seconds' : '0s';

  const timeUnits = isLong ? TIME_UNITS_LONG : TIME_UNITS_SHORT;

  let result = '';
  let remainingSeconds = seconds;

  // Optimization: standard for loop and direct string concatenation
  // without Array.push().join() or template literals
  for (let i = 0; i < timeUnits.length; i++) {
    const unit = timeUnits[i];
    const unitSeconds = unit.seconds;

    // integer division
    const count = Math.floor(remainingSeconds / unitSeconds);
    if (count > 0) {
      if (result.length > 0) {
        result += ' ';
      }

      if (isLong) {
        result += count + ' ' + unit.label + (count > 1 ? 's' : '');
      } else {
        result += count + unit.label;
      }

      remainingSeconds %= unitSeconds;
    }
  }

  return result;
}

console.log(`Benchmarking formatDuration with ${ITERATIONS} iterations...`);

let start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  formatDuration(3661); // 1h 1m 1s
  formatDuration(3661, { style: 'long' });
}
let end = performance.now();
console.log(`Current Total time: ${(end - start).toFixed(2)}ms`);

start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  formatDurationOptimized(3661); // 1h 1m 1s
  formatDurationOptimized(3661, { style: 'long' });
}
end = performance.now();
console.log(`Optimized Total time: ${(end - start).toFixed(2)}ms`);
