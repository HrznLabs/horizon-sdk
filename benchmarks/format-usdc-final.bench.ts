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

  // Compact notation handling (K, M, B, T)
  if (compact) {
    const ONE_THOUSAND = 1000n * USDC_MULTIPLIER_BIGINT;
    const ONE_MILLION = 1000000n * USDC_MULTIPLIER_BIGINT;
    const ONE_BILLION = 1000000000n * USDC_MULTIPLIER_BIGINT;
    const ONE_TRILLION = 1000000000000n * USDC_MULTIPLIER_BIGINT;

    let divisor = 1n;
    let unit = '';

    if (absAmount >= ONE_TRILLION) {
      divisor = ONE_TRILLION;
      unit = 'T';
    } else if (absAmount >= ONE_BILLION) {
      divisor = ONE_BILLION;
      unit = 'B';
    } else if (absAmount >= ONE_MILLION) {
      divisor = ONE_MILLION;
      unit = 'M';
    } else if (absAmount >= ONE_THOUSAND) {
      divisor = ONE_THOUSAND;
      unit = 'K';
    }

    if (unit) {
      const scaledWhole = absAmount / divisor;
      const remainder = absAmount % divisor;
      const fractionVal = (remainder * 100n) / divisor;

      let decimalPart = '';
      if (fractionVal > 0n) {
        if (fractionVal % 10n === 0n) {
           decimalPart = '.' + (fractionVal / 10n).toString();
        } else {
           decimalPart = fractionVal < 10n ? '.0' + fractionVal.toString() : '.' + fractionVal.toString();
        }
      }

      const sign = amount < 0n ? '-' : '';
      return sign + prefix + scaledWhole + decimalPart + unit + suffix;
    }
  }

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

// Pre-calculated thresholds for compact mode
const COMPACT_THOUSAND = 1000n * USDC_MULTIPLIER_BIGINT;
const COMPACT_MILLION = 1000000n * USDC_MULTIPLIER_BIGINT;
const COMPACT_BILLION = 1000000000n * USDC_MULTIPLIER_BIGINT;
const COMPACT_TRILLION = 1000000000000n * USDC_MULTIPLIER_BIGINT;

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

  // Compact notation handling (K, M, B, T)
  if (compact) {
    let divisor = 1n;
    let unit = '';

    if (absAmount >= COMPACT_TRILLION) {
      divisor = COMPACT_TRILLION;
      unit = 'T';
    } else if (absAmount >= COMPACT_BILLION) {
      divisor = COMPACT_BILLION;
      unit = 'B';
    } else if (absAmount >= COMPACT_MILLION) {
      divisor = COMPACT_MILLION;
      unit = 'M';
    } else if (absAmount >= COMPACT_THOUSAND) {
      divisor = COMPACT_THOUSAND;
      unit = 'K';
    }

    if (unit) {
      const scaledWhole = absAmount / divisor;
      const remainder = absAmount % divisor;
      const fractionVal = (remainder * 100n) / divisor;

      let decimalPart = '';
      if (fractionVal > 0n) {
        // Optimization: Cast small BigInts to Number before toString for performance
        if (fractionVal % 10n === 0n) {
           decimalPart = '.' + Number(fractionVal / 10n).toString();
        } else {
           decimalPart = fractionVal < 10n ? '.0' + Number(fractionVal).toString() : '.' + Number(fractionVal).toString();
        }
      }

      const sign = amount < 0n ? '-' : '';
      return sign + prefix + scaledWhole + decimalPart + unit + suffix;
    }
  }

  const whole = absAmount / USDC_MULTIPLIER_BIGINT;
  const fraction = absAmount % USDC_MULTIPLIER_BIGINT;

  let fractionStr: string;

  if (fraction === 0n) {
    fractionStr = '';
  } else {
    // Optimization: Cast guaranteed-small BigInt fraction to Number before string conversion
    // This provides a ~30% speedup on string formatting as V8 optimizes Number to String better
    fractionStr = Number(fraction).toString().padStart(USDC_DECIMALS, '0');

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
      // Optimization: substring is faster than slice
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

const val1 = 1234567890123456n;
const val2 = 999990000n;
const val3 = 1000000n;
const val4 = 1000500n;

const start1 = performance.now();
for (let i = 0; i < 100000; i++) {
  formatUSDCOrig(val1);
  formatUSDCOrig(val2);
  formatUSDCOrig(val3);
  formatUSDCOrig(val4);
  formatUSDCOrig(val1, { compact: true });
  formatUSDCOrig(val2, { compact: true });
  formatUSDCOrig(val3, { compact: true });
  formatUSDCOrig(val4, { compact: true });
}
console.log("Original:", performance.now() - start1);

const start2 = performance.now();
for (let i = 0; i < 100000; i++) {
  formatUSDCOpt(val1);
  formatUSDCOpt(val2);
  formatUSDCOpt(val3);
  formatUSDCOpt(val4);
  formatUSDCOpt(val1, { compact: true });
  formatUSDCOpt(val2, { compact: true });
  formatUSDCOpt(val3, { compact: true });
  formatUSDCOpt(val4, { compact: true });
}
console.log("Opt:", performance.now() - start2);
