const ITERATIONS = 1_000_000;

function formatBpsOriginal(
  bps: number,
  options?: { minDecimals?: number; prefix?: string; suffix?: string }
): string {
  if (!Number.isFinite(bps)) {
    throw new Error('bps must be a finite number');
  }

  let minDecimals = options?.minDecimals || 0;
  if (minDecimals > 100) minDecimals = 100;
  const prefix = options?.prefix || '';
  const suffix = options?.suffix !== undefined ? options.suffix : '%';

  const sign = bps < 0 ? '-' : '';
  const absBps = Math.abs(bps);
  const percentage = absBps / 100;
  let formatted = percentage.toString();

  if (minDecimals > 0) {
    // Optimization: Avoid creating an array with split()
    const dotIndex = formatted.indexOf('.');
    const decimals = dotIndex === -1 ? 0 : formatted.length - dotIndex - 1;
    if (decimals < minDecimals) {
      formatted = percentage.toFixed(minDecimals);
    }
  }

  return `${sign}${prefix}${formatted}${suffix}`;
}

function formatBpsOpt(
  bps: number,
  options?: { minDecimals?: number; prefix?: string; suffix?: string }
): string {
  if (!Number.isFinite(bps)) {
    throw new Error('bps must be a finite number');
  }

  let minDecimals = options?.minDecimals || 0;
  if (minDecimals > 100) minDecimals = 100;
  const prefix = options?.prefix || '';
  const suffix = options?.suffix !== undefined ? options.suffix : '%';

  const sign = bps < 0 ? '-' : '';
  const absBps = Math.abs(bps);
  const percentage = absBps / 100;
  let formatted = percentage.toString();

  if (minDecimals > 0) {
    // Optimization: Avoid creating an array with split()
    const dotIndex = formatted.indexOf('.');
    const decimals = dotIndex === -1 ? 0 : formatted.length - dotIndex - 1;
    if (decimals < minDecimals) {
      formatted = percentage.toFixed(minDecimals);
    }
  }

  return sign + prefix + formatted + suffix;
}

const bpsValues = [150, 0, -500, 125.5];

let start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  for (const bps of bpsValues) {
    formatBpsOriginal(bps);
  }
}
let end = performance.now();
console.log(`Original formatBps time: ${(end - start).toFixed(2)}ms`);

start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  for (const bps of bpsValues) {
    formatBpsOpt(bps);
  }
}
end = performance.now();
console.log(`Optimized formatBps time: ${(end - start).toFixed(2)}ms`);
