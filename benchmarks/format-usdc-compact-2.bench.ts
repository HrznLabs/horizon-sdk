const ITERATIONS = 1_000_000;
const amounts = [
  1500000000000n, // 1.5M
  1500000000000000n, // 1.5B
];
const options = { commas: true, minDecimals: 2, compact: true };

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

      let decimals = 2;

      const fractionVal = (remainder * BigInt(10 ** decimals)) / divisor;
      let fractionStr = fractionVal.toString();

      fractionStr = fractionStr.padStart(decimals, '0');

      let i = fractionStr.length - 1;
      while (i >= 0 && fractionStr[i] === '0') {
        i--;
      }
      fractionStr = fractionStr.substring(0, i + 1);

      const sign = amount < 0n ? '-' : '';
      const decimalPart = fractionStr.length > 0 ? `.${fractionStr}` : '';

      return `${sign}${prefix}${scaledWhole}${decimalPart}${unit}${suffix}`;
    }
  }

  return "";
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

      // Calculate fractional part (simulate 2 decimal places for compact)
      // Math based calculation to avoid string allocations
      const fractionVal = Number((remainder * 100n) / divisor);

      let decimalPart = '';
      if (fractionVal > 0) {
        if (fractionVal % 10 === 0) {
          decimalPart = '.' + (fractionVal / 10).toString();
        } else {
          decimalPart = '.' + (fractionVal < 10 ? '0' + fractionVal : fractionVal.toString());
        }
      }

      const sign = amount < 0n ? '-' : '';

      // Optimization: direct string concatenation instead of template literals
      return sign + prefix + scaledWhole.toString() + decimalPart + unit + suffix;
    }
  }
  return "";
}

let start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  for (const amt of amounts) {
    formatUSDCOriginal(amt, options);
  }
}
let end = performance.now();
console.log(`Original compact formatUSDC time: ${(end - start).toFixed(2)}ms`);

start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  for (const amt of amounts) {
    formatUSDCOpt(amt, options);
  }
}
end = performance.now();
console.log(`Optimized compact formatUSDC time: ${(end - start).toFixed(2)}ms`);
