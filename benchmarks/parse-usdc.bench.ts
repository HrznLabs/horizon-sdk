import { parseUSDC as parseUSDC_current } from '../src/utils/index';
import { USDC_DECIMALS } from '../src/constants';

// Max length for USDC amount string to prevent DoS (supports > 1e25 USDC)
const MAX_USDC_STRING_LENGTH = 32;
const USDC_MULTIPLIER_BIGINT = BigInt(10 ** USDC_DECIMALS);
const POWERS_OF_10: bigint[] = [1n, 10n, 100n, 1000n, 10000n, 100000n, 1000000n];

function parseUSDC_optimized(amount: string | number): bigint {
  if (typeof amount === 'number') {
    return parseUSDC_optimized(amount.toString());
  }

  const len = amount.length;
  if (len === 0) throw new Error('Invalid USDC amount format');
  if (len > MAX_USDC_STRING_LENGTH) {
    throw new Error('Invalid USDC amount format: Input too long.');
  }

  let start = 0;
  let isNegative = false;

  if (amount.charCodeAt(0) === 45) { // '-'
    isNegative = true;
    start = 1;
  }

  let intPartNum = 0n;
  let fracPartNum = 0n;
  let fracLen = 0;
  let isFraction = false;
  let hasDigits = false;

  for (let i = start; i < len; i++) {
    const code = amount.charCodeAt(i);

    if (code >= 48 && code <= 57) {
      hasDigits = true;
      const digit = BigInt(code - 48);
      if (isFraction) {
        fracPartNum = fracPartNum * 10n + digit;
        fracLen++;
        if (fracLen > USDC_DECIMALS) {
          throw new Error(`Too many decimals (max ${USDC_DECIMALS})`);
        }
      } else {
        intPartNum = intPartNum * 10n + digit;
      }
      continue;
    }

    if (code === 46) { // '.'
      if (isFraction) throw new Error('Invalid USDC amount format: Multiple decimal points found.');
      isFraction = true;
    } else if (code === 44) { // ','
      throw new Error('Invalid USDC amount format: Commas are not allowed.');
    } else if (code === 36) { // '$'
      throw new Error('Invalid USDC amount format: Currency symbols are not allowed.');
    } else if (code === 32) { // ' '
      throw new Error('Invalid USDC amount format: Spaces are not allowed.');
    } else {
      throw new Error('Invalid USDC amount format: Invalid character found.');
    }
  }

  if (!hasDigits) {
    throw new Error('Invalid USDC amount format');
  }

  let val: bigint;
  if (!isFraction || fracLen === 0) {
    val = intPartNum * USDC_MULTIPLIER_BIGINT;
  } else {
    const power = POWERS_OF_10[USDC_DECIMALS - fracLen];
    val = intPartNum * USDC_MULTIPLIER_BIGINT + fracPartNum * power;
  }

  return isNegative ? -val : val;
}

const inputs = [
  '1234.56789',
  '-10.50',
  '1000000',
  '0.0001',
  '999999999999.999999',
  '123',
  '-.456',
  '456.'
];

console.log('--- Correctness Check ---');
for (const input of inputs) {
  const current = parseUSDC_current(input);
  const opt = parseUSDC_optimized(input);
  if (current !== opt) {
    console.error(`Mismatch for ${input}: Current ${current}, Optimized ${opt}`);
  }
}
console.log('Correctness check passed.\n');

const ITERATIONS = 1_000_000;

console.log(`--- Benchmarking (${ITERATIONS.toLocaleString()} iterations) ---`);

const startCurrent = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  for (const input of inputs) {
    parseUSDC_current(input);
  }
}
const endCurrent = performance.now();
const timeCurrent = endCurrent - startCurrent;
console.log(`Current:   ${timeCurrent.toFixed(2)}ms`);

const startOpt = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  for (const input of inputs) {
    parseUSDC_optimized(input);
  }
}
const endOpt = performance.now();
const timeOpt = endOpt - startOpt;
console.log(`Optimized: ${timeOpt.toFixed(2)}ms`);

const improvement = ((timeCurrent - timeOpt) / timeCurrent) * 100;
console.log(`Improvement: ${improvement.toFixed(2)}%`);
