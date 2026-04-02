const USDC_MULTIPLIER_BIGINT = 1000000n;
const USDC_DECIMALS = 6;
const MAX_DECIMALS = 100;

function formatUSDCOrig(
  amount: bigint,
  options?: { minDecimals?: number; prefix?: string; suffix?: string; commas?: boolean; compact?: boolean }
): string {
  const compact = options?.compact === true;
  let minDecimals = options?.minDecimals || 0;
  if (minDecimals > MAX_DECIMALS) minDecimals = MAX_DECIMALS;
  const prefix = options?.prefix || '';
  const suffix = options?.suffix || '';
  const useCommas = options?.commas !== false;

  const absAmount = amount < 0n ? -amount : amount;

  // skipping compact logic for this bench

  const whole = absAmount / USDC_MULTIPLIER_BIGINT;
  const fraction = absAmount % USDC_MULTIPLIER_BIGINT;

  let fractionStr: string;

  if (fraction === 0n) {
    fractionStr = '';
  } else {
    fractionStr = fraction.toString().padStart(USDC_DECIMALS, '0');
    let i = fractionStr.length - 1;
    while (i >= 0 && fractionStr.charCodeAt(i) === 48) {
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
      let formatted = wholeStr.slice(0, start);
      for (let i = start; i < len; i += 3) {
        formatted += ',' + wholeStr.slice(i, i + 3);
      }
      wholeStr = formatted;
    }
  }

  if (fractionStr === '') {
    return sign + prefix + wholeStr + suffix;
  }

  return sign + prefix + wholeStr + '.' + fractionStr + suffix;
}

function formatUSDCOpt(
  amount: bigint,
  options?: { minDecimals?: number; prefix?: string; suffix?: string; commas?: boolean; compact?: boolean }
): string {
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
    // Math to strip zeroes instead of strings?
    // Let's try it for fractions
    let f = Number(fraction); // safe since fraction < 1M
    while (f % 10 === 0 && f > 0) f /= 10;

    // Oh wait, this would turn 500 into 5, but we need 000500 -> 0005.
    // We would need to keep track of length.
    fractionStr = fraction.toString().padStart(USDC_DECIMALS, '0');
    let i = fractionStr.length - 1;
    while (i >= 0 && fractionStr.charCodeAt(i) === 48) {
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
      let formatted = '';
      let r = len % 3;
      if (r === 0) r = 3;
      formatted = wholeStr.substring(0, r);
      for (let i = r; i < len; i += 3) {
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

const val1 = 1234567890123456n;
const val2 = 999990000n;
const val3 = 1n;

const start1 = performance.now();
for (let i = 0; i < 100000; i++) {
  formatUSDCOrig(val1);
  formatUSDCOrig(val2);
  formatUSDCOrig(val3);
}
console.log("Original:", performance.now() - start1);

const start2 = performance.now();
for (let i = 0; i < 100000; i++) {
  formatUSDCOpt(val1);
  formatUSDCOpt(val2);
  formatUSDCOpt(val3);
}
console.log("Opt:", performance.now() - start2);
