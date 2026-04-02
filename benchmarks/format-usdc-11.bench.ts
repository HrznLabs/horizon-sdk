// Testing `Number(fraction).toString` impact properly
const USDC_DECIMALS = 6;
const USDC_MULTIPLIER_BIGINT = 1000000n;

function formatUSDCOrig(amount: bigint) {
  const fraction = amount % USDC_MULTIPLIER_BIGINT;
  if (fraction === 0n) return '';
  let fractionStr = fraction.toString().padStart(USDC_DECIMALS, '0');
  let i = fractionStr.length - 1;
  while (i >= 0 && fractionStr.charCodeAt(i) === 48) {
    i--;
  }
  return fractionStr.substring(0, i + 1);
}

function formatUSDCOpt(amount: bigint) {
  const fraction = amount % USDC_MULTIPLIER_BIGINT;
  if (fraction === 0n) return '';
  let fractionStr = Number(fraction).toString().padStart(USDC_DECIMALS, '0');
  let i = fractionStr.length - 1;
  while (i >= 0 && fractionStr.charCodeAt(i) === 48) {
    i--;
  }
  return fractionStr.substring(0, i + 1);
}

const val1 = 123456n;
const start1 = performance.now();
for (let i = 0; i < 1000000; i++) {
  formatUSDCOrig(val1);
}
console.log("Original:", performance.now() - start1);

const start2 = performance.now();
for (let i = 0; i < 1000000; i++) {
  formatUSDCOpt(val1);
}
console.log("Opt Number():", performance.now() - start2);
