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
  // Let's optimize Math.floor(Date.now() / 1000)
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

const start1 = performance.now();
for (let i = 0; i < 1000000; i++) {
  calculateExpiresAtOrig(3600);
}
console.log("Original:", performance.now() - start1);
