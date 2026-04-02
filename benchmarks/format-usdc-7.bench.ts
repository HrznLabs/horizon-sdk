// Try to optimize `fractionStr` trailing zero trimming
const USDC_DECIMALS = 6;

function trimZerosOrig(fraction: bigint): string {
  let fractionStr = fraction.toString().padStart(USDC_DECIMALS, '0');
  let i = fractionStr.length - 1;
  while (i >= 0 && fractionStr.charCodeAt(i) === 48) {
    i--;
  }
  return fractionStr.substring(0, i + 1);
}

function trimZerosOpt(fraction: bigint): string {
  // Let's divide by 10n until no longer divisible to avoid string charCodeAt loop?
  let f = fraction;
  while (f % 10n === 0n && f > 0n) {
    f /= 10n;
  }
  // Now we need to pad start based on how many zeros we trimmed? No, pad start based on USDC_DECIMALS, but we don't know how many decimals to pad to unless we keep track of the length.
  // This is what we learned from memory:
  // "For operations like trailing zero trimming in formatUSDC, string-based zero-padding (padStart) and backwards iteration with substring are faster than native BigInt math loops (/= 10n), as the JS engine heavily optimizes these string operations."
  // Okay, the original is already optimal.
  return f.toString();
}
