const ITERATIONS = 100_000;
const amounts = [
  1234567890123n, // 1,234,567.890123
  1234000000n,    // 1,234.0
  1234500000n,    // 1,234.5
  50000n,         // 0.05
  1000n,          // 0.001
  0n              // 0
];
const options = { commas: true, minDecimals: 2 };

function formatUSDCOriginal(
  amount: bigint,
  options?: { minDecimals?: number; prefix?: string; suffix?: string; commas?: boolean; compact?: boolean }
): string {
  const USDC_MULTIPLIER_BIGINT = 1000000n;
  const USDC_DECIMALS = 6;
  const MAX_DECIMALS = 100;

  const compact = options?.compact === true;
  let minDecimals = options?.minDecimals || 0;
  if (minDecimals > MAX_DECIMALS) minDecimals = MAX_DECIMALS;
  const prefix = options?.prefix || '';
  const suffix = options?.suffix || '';
  const useCommas = options?.commas !== false;

  const absAmount = amount < 0n ? -amount : amount;

  const whole = absAmount / USDC_MULTIPLIER_BIGINT;
  const fraction = absAmount % USDC_MULTIPLIER_BIGINT;

  let fractionStr: string;

  if (fraction === 0n) {
    fractionStr = '';
  } else {
    fractionStr = fraction.toString().padStart(USDC_DECIMALS, '0');

    let i = fractionStr.length - 1;
    while (i >= 0 && fractionStr[i] === '0') {
      i--;
    }
    fractionStr = fractionStr.substring(0, i + 1);
  }

  if (minDecimals > 0) {
    fractionStr = fractionStr.padEnd(minDecimals, '0');
  }

  const sign = amount < 0n ? '-' : '';

  let wholeStr = whole.toString();
  if (useCommas) {
    const len = wholeStr.length;
    if (len > 3) {
      let start = len % 3;
      if (start === 0) start = 3;
      // original format string manipulation is slow but we'll optimize string formatting inside the whole
      let formatted = wholeStr.slice(0, start);
      for (let i = start; i < len; i += 3) {
        formatted += ',' + wholeStr.slice(i, i + 3);
      }
      wholeStr = formatted;
    }
  }

  if (fractionStr === '') {
    return `${sign}${prefix}${wholeStr}${suffix}`;
  }

  return `${sign}${prefix}${wholeStr}.${fractionStr}${suffix}`;
}

function formatUSDCOpt(
  amount: bigint,
  options?: { minDecimals?: number; prefix?: string; suffix?: string; commas?: boolean; compact?: boolean }
): string {
  const USDC_MULTIPLIER_BIGINT = 1000000n;
  const USDC_DECIMALS = 6;
  const MAX_DECIMALS = 100;

  const compact = options?.compact === true;
  let minDecimals = options?.minDecimals || 0;
  if (minDecimals > MAX_DECIMALS) minDecimals = MAX_DECIMALS;
  const prefix = options?.prefix || '';
  const suffix = options?.suffix || '';
  const useCommas = options?.commas !== false;

  const absAmount = amount < 0n ? -amount : amount;

  const whole = absAmount / USDC_MULTIPLIER_BIGINT;
  const fraction = absAmount % USDC_MULTIPLIER_BIGINT;

  let fractionStr: string;

  if (fraction === 0n) {
    fractionStr = '';
  } else {
    fractionStr = fraction.toString().padStart(USDC_DECIMALS, '0');

    let i = fractionStr.length - 1;
    while (i >= 0 && fractionStr[i] === '0') {
      i--;
    }
    fractionStr = fractionStr.substring(0, i + 1);
  }

  if (minDecimals > 0) {
    fractionStr = fractionStr.padEnd(minDecimals, '0');
  }

  const sign = amount < 0n ? '-' : '';

  let wholeStr = whole.toString();
  if (useCommas) {
    const len = wholeStr.length;
    if (len > 3) {
      let start = len % 3;
      if (start === 0) start = 3;
      let formatted = wholeStr.substring(0, start);
      for (let i = start; i < len; i += 3) {
        formatted += ',' + wholeStr.substring(i, i + 3);
      }
      wholeStr = formatted;
    }
  }

  if (fractionStr === '') {
    return sign + prefix + wholeStr + suffix;
  }

  return sign + prefix + wholeStr + '.' + fractionStr + suffix;
}

let start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  for (const amt of amounts) {
    formatUSDCOriginal(amt, options);
  }
}
let end = performance.now();
console.log(`Original formatUSDC time: ${(end - start).toFixed(2)}ms`);

start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  for (const amt of amounts) {
    formatUSDCOpt(amt, options);
  }
}
end = performance.now();
console.log(`Optimized formatUSDC time: ${(end - start).toFixed(2)}ms`);
