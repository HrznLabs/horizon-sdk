// Try to optimize formatUSDC compact string building further!
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

  // skipping non-compact...
  return "";
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

  const absAmount = amount < 0n ? -amount : amount;

  if (compact) {
    const ONE_THOUSAND = 1000000000n; // 1000 * 10^6
    const ONE_MILLION = 1000000000000n;
    const ONE_BILLION = 1000000000000000n;
    const ONE_TRILLION = 1000000000000000000n;

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
  return "";
}

const val1 = 1234567890123456n;
const val2 = 999990000n;
const val3 = 1000000n;

const start1 = performance.now();
for (let i = 0; i < 100000; i++) {
  formatUSDCOrig(val1, { compact: true });
  formatUSDCOrig(val2, { compact: true });
  formatUSDCOrig(val3, { compact: true });
}
console.log("Original:", performance.now() - start1);

const start2 = performance.now();
for (let i = 0; i < 100000; i++) {
  formatUSDCOpt(val1, { compact: true });
  formatUSDCOpt(val2, { compact: true });
  formatUSDCOpt(val3, { compact: true });
}
console.log("Opt:", performance.now() - start2);
