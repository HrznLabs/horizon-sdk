import { formatUSDC } from '../src/utils/index';
import { performance } from 'perf_hooks';

// This includes the current code for formatUSDC compact
function formatUSDC_opt(
  amount: bigint,
  options?: { minDecimals?: number; prefix?: string; suffix?: string; commas?: boolean; compact?: boolean }
): string {
  const compact = options?.compact === true;
  let minDecimals = options?.minDecimals || 0;
  if (minDecimals > 100) minDecimals = 100;
  const prefix = options?.prefix || '';
  const suffix = options?.suffix || '';
  const useCommas = options?.commas !== false;

  const absAmount = amount < 0n ? -amount : amount;

  if (compact) {
    const ONE_THOUSAND = 1000000000n;
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

      let fractionStr = '';
      if (fractionVal > 0n) {
          if (fractionVal < 10n) {
              fractionStr = '.0' + fractionVal.toString();
          } else {
              fractionStr = fractionVal.toString();
              if (fractionStr[1] === '0') {
                  fractionStr = '.' + fractionStr[0];
              } else {
                  fractionStr = '.' + fractionStr;
              }
          }
      }

      const sign = amount < 0n ? '-' : '';

      return sign + prefix + scaledWhole.toString() + fractionStr + unit + suffix;
    }
  }

  return '';
}

function benchmark() {
  const iterations = 1000000;

  const testCases = [
    1500000000000n, // 1.5K
    1550000000000n, // 1.55K
    1005000000000n, // 1.005K -> 1K
    1010000000000n, // 1.01K
    1000000000000n, // 1K
    -1500000000000n, // -1.5K
    2500000000000000n, // 2.5M
  ];

  for (const tc of testCases) {
      if (formatUSDC(tc, {compact: true}) !== formatUSDC_opt(tc, {compact: true})) {
          console.error(`Mismatch for ${tc}: ${formatUSDC(tc, {compact: true})} !== ${formatUSDC_opt(tc, {compact: true})}`);
      }
  }

  const start3 = performance.now();
  for (let i = 0; i < iterations; i++) {
    for (const tc of testCases) {
        formatUSDC(tc, { compact: true });
    }
  }
  const end3 = performance.now();
  console.log(`formatUSDC compact: ${(end3 - start3).toFixed(2)}ms`);

  const start4 = performance.now();
  for (let i = 0; i < iterations; i++) {
    for (const tc of testCases) {
        formatUSDC_opt(tc, { compact: true });
    }
  }
  const end4 = performance.now();
  console.log(`formatUSDC_opt compact: ${(end4 - start4).toFixed(2)}ms`);

}

benchmark();
