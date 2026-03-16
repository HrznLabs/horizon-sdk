const ITERATIONS = 100_000;
const amount = 1234567890123n; // 1,234,567.890123
const options = { commas: true, minDecimals: 2 };

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
    // Math based fraction truncation instead of string.padStart + while loop trim
    let tempFraction = Number(fraction);
    let zeroes = USDC_DECIMALS;

    // Trim trailing zeroes via Math
    while (tempFraction % 10 === 0 && tempFraction > 0) {
      tempFraction /= 10;
      zeroes--;
    }

    // We still need padding if leading zeroes existed...
    fractionStr = tempFraction.toString();
    // length might still be shorter than zeroes if there were leading zeroes!
    // Example: 0.050000 -> fraction = 50000. tempFraction becomes 5. zeroes becomes 2 (since we removed 4 zeroes).
    // so we need to padStart(zeroes, '0')
    if (fractionStr.length < zeroes) {
       fractionStr = fractionStr.padStart(zeroes, '0');
    }
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

let start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  formatUSDCOpt(amount, options);
}
let end = performance.now();
console.log(`Optimized formatUSDC time: ${(end - start).toFixed(2)}ms`);
