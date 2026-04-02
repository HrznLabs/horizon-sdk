const MIN_DURATION = 3600; // 1 hour
const MAX_DURATION = 31536000; // 1 year

export function calculateExpiresAtOrig(durationSeconds: number): bigint {
  if (!Number.isFinite(durationSeconds)) {
    throw new Error('Duration must be a finite number');
  }
  if (!Number.isInteger(durationSeconds)) {
    throw new Error('Duration must be an integer.');
  }
  if (durationSeconds < MIN_DURATION || durationSeconds > MAX_DURATION) {
    throw new Error(
      `Duration must be between ${MIN_DURATION} and ${MAX_DURATION} seconds.`
    );
  }
  return BigInt(Math.floor(Date.now() / 1000) + durationSeconds);
}

export function calculateExpiresAtOpt(durationSeconds: number): bigint {
  if (!Number.isFinite(durationSeconds)) {
    throw new Error('Duration must be a finite number');
  }
  if (!Number.isInteger(durationSeconds)) {
    throw new Error('Duration must be an integer.');
  }
  if (durationSeconds < MIN_DURATION || durationSeconds > MAX_DURATION) {
    throw new Error(
      `Duration must be between ${MIN_DURATION} and ${MAX_DURATION} seconds.`
    );
  }
  // Optimization: Bitwise OR with 0 truncates to 32-bit integer.
  // This is faster than Math.floor() for positive numbers.
  // Current time / 1000 fits in a 32-bit signed integer until year 2038.
  return BigInt((Date.now() / 1000 | 0) + durationSeconds);
}

const start1 = performance.now();
for (let i = 0; i < 1000000; i++) {
  calculateExpiresAtOrig(3600);
}
console.log("Original:", performance.now() - start1);

const start2 = performance.now();
for (let i = 0; i < 1000000; i++) {
  calculateExpiresAtOpt(3600);
}
console.log("Opt bitwise:", performance.now() - start2);
