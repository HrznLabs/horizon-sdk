// Try to optimize formatUSDC fraction formatting completely
const USDC_MULTIPLIER_BIGINT = 1000000n;
const USDC_DECIMALS = 6;
const MAX_DECIMALS = 100;

function formatUSDCOrig(
  amount: bigint,
  options?: { minDecimals?: number; prefix?: string; suffix?: string; commas?: boolean; compact?: boolean }
): string {
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
    while (i >= 0 && fractionStr.charCodeAt(i) === 48) {
      i--;
    }
    fractionStr = fractionStr.substring(0, i + 1);
  }

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
    return wholeStr;
  }

  return wholeStr + '.' + fractionStr;
}

function formatUSDCOpt(
  amount: bigint,
  options?: { minDecimals?: number; prefix?: string; suffix?: string; commas?: boolean; compact?: boolean }
): string {
  const useCommas = options?.commas !== false;
  const absAmount = amount < 0n ? -amount : amount;

  const whole = absAmount / USDC_MULTIPLIER_BIGINT;
  const fraction = absAmount % USDC_MULTIPLIER_BIGINT;

  let fractionStr: string;

  if (fraction === 0n) {
    fractionStr = '';
  } else {
    // Instead of BigInt.toString, which converts BigInt to String, let's use Number(fraction) since fraction < 1,000,000
    // Number.toString is much faster than BigInt.toString
    const numFrac = Number(fraction);
    fractionStr = numFrac.toString().padStart(USDC_DECIMALS, '0');
    let i = fractionStr.length - 1;
    while (i >= 0 && fractionStr.charCodeAt(i) === 48) {
      i--;
    }
    fractionStr = fractionStr.substring(0, i + 1);
  }

  // Also convert whole to number if it's small enough?
  // whole can be > Number.MAX_SAFE_INTEGER. So stick to BigInt for whole.
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
    return wholeStr;
  }

  return wholeStr + '.' + fractionStr;
}

const val1 = 1234567890123456n;
const val2 = 999990000n;
const val3 = 1000000n;

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
console.log("Opt Number():", performance.now() - start2);
