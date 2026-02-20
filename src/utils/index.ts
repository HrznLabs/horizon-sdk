// =============================================================================
// HORIZON PROTOCOL - UTILITY FUNCTIONS
// =============================================================================

import { USDC_DECIMALS, FEES, MIN_DURATION, MAX_DURATION } from '../constants';
import type { FeeSplit } from '../types';

// Pre-calculated constants to improve performance
const BPS_DIVISOR = BigInt(10000);
const USDC_MULTIPLIER_NUM = 10 ** USDC_DECIMALS;
const USDC_MULTIPLIER_BIGINT = BigInt(USDC_MULTIPLIER_NUM);

// Max length for USDC amount string to prevent DoS (supports > 1e25 USDC)
const MAX_USDC_STRING_LENGTH = 32;

// Optimization: Pre-calculate powers of 10 for parseUSDC
const POWERS_OF_10: bigint[] = [
  1n,
  10n,
  100n,
  1000n,
  10000n,
  100000n,
  1000000n,
];

const PROTOCOL_BPS_BIGINT = BigInt(FEES.PROTOCOL_BPS);
const LABS_BPS_BIGINT = BigInt(FEES.LABS_BPS);
const RESOLVER_BPS_BIGINT = BigInt(FEES.RESOLVER_BPS);
const DDR_BPS_BIGINT = BigInt(FEES.DDR_BPS);
const LPP_BPS_BIGINT = BigInt(FEES.LPP_BPS);

// Performance optimization: Reusable TextEncoder and hex lookup table
// Hoisting these avoids re-instantiation and array creation overhead
const TEXT_ENCODER = new TextEncoder();
const HEX_STRINGS: string[] = [];
for (let i = 0; i < 256; i++) {
  HEX_STRINGS.push(i.toString(16).padStart(2, '0'));
}

/**
 * Parse USDC amount from human-readable string to bigint
 * Optimized to avoid parseFloat precision issues and improve performance
 * @param amount Human-readable amount (e.g., "10.50")
 * @returns Amount in USDC base units (bigint)
 */
export function parseUSDC(amount: string | number): bigint {
  if (typeof amount === 'number') {
    return parseUSDC(amount.toString());
  }

  const len = amount.length;
  if (len === 0) throw new Error(`Invalid USDC amount format: "${amount}"`);
  if (len > MAX_USDC_STRING_LENGTH) {
    throw new Error('Invalid USDC amount format: Input too long.');
  }

  let dotIndex = -1;
  let start = 0;
  let isNegative = false;

  if (amount.charCodeAt(0) === 45) { // '-'
    isNegative = true;
    start = 1;
  }

  // Validate chars and find dot
  for (let i = start; i < len; i++) {
    const code = amount.charCodeAt(i);

    // Optimization: Check for digits first as they are the most common
    if (code >= 48 && code <= 57) {
      continue;
    }

    if (code === 46) { // '.'
      if (dotIndex !== -1) throw new Error(`Invalid USDC amount format: "${amount}". Multiple decimal points found.`);
      dotIndex = i;
    } else if (code === 44) { // ','
      throw new Error(`Invalid USDC amount format: "${amount}". Commas are not allowed, please remove thousands separators.`);
    } else if (code === 36) { // '$'
      throw new Error(`Invalid USDC amount format: "${amount}". Currency symbols are not allowed.`);
    } else if (code === 32) { // ' '
      throw new Error(`Invalid USDC amount format: "${amount}". Spaces are not allowed.`);
    } else {
      throw new Error(`Invalid USDC amount format: "${amount}". Invalid character '${amount[i]}' found.`);
    }
  }

  let integerPartStr: string;
  let fractionPartStr: string;

  if (dotIndex === -1) {
    integerPartStr = start === 0 ? amount : amount.substring(start);
    fractionPartStr = "";
  } else {
    integerPartStr = amount.substring(start, dotIndex);
    fractionPartStr = amount.substring(dotIndex + 1);
  }

  if (integerPartStr === "" && fractionPartStr === "") {
    throw new Error(`Invalid USDC amount format: "${amount}"`);
  }

  const fracLen = fractionPartStr.length;
  if (fracLen > USDC_DECIMALS) {
    throw new Error(`Too many decimals: "${amount}" (max ${USDC_DECIMALS})`);
  }

  // Optimize: Avoid string concatenation and padding by using math
  const intPart = integerPartStr === '' ? 0n : BigInt(integerPartStr);

  let val: bigint;
  if (fractionPartStr === '') {
    val = intPart * USDC_MULTIPLIER_BIGINT;
  } else {
    const fracPart = BigInt(fractionPartStr);
    // Use pre-calculated power to scale fraction correctly
    const power = POWERS_OF_10[USDC_DECIMALS - fracLen];
    val = intPart * USDC_MULTIPLIER_BIGINT + fracPart * power;
  }

  return isNegative ? -val : val;
}

/**
 * Format USDC amount from bigint to human-readable string with commas and trimmed zeros
 * @param amount Amount in USDC base units
 * @param options Formatting options
 * @returns Human-readable amount string (e.g. "1,000.50")
 */
export function formatUSDC(
  amount: bigint,
  options?: { minDecimals?: number; prefix?: string; commas?: boolean }
): string {
  const minDecimals = options?.minDecimals || 0;
  const prefix = options?.prefix || '';
  const useCommas = options?.commas !== false;

  const absAmount = amount < 0n ? -amount : amount;
  const whole = absAmount / USDC_MULTIPLIER_BIGINT;
  const fraction = absAmount % USDC_MULTIPLIER_BIGINT;

  let fractionStr: string;

  // Optimization: Handle integer case early to avoid string operations
  if (fraction === 0n) {
    fractionStr = '';
  } else {
    fractionStr = fraction.toString().padStart(USDC_DECIMALS, '0');

    // Trim trailing zeros for cleaner display
    // Optimization: Manual loop is ~60% faster than regex replace(/0+$/, '')
    let i = fractionStr.length - 1;
    while (i >= 0 && fractionStr[i] === '0') {
      i--;
    }
    fractionStr = fractionStr.substring(0, i + 1);
  }

  if (minDecimals > 0) {
    fractionStr = fractionStr.padEnd(minDecimals, '0');
  }

  const sign = amount < 0n ? '-' : '';

  // Performance optimization: Manual comma insertion is ~2.7x faster than toLocaleString
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
    return `${sign}${prefix}${wholeStr}`;
  }

  return `${sign}${prefix}${wholeStr}.${fractionStr}`;
}

/**
 * Format basis points as a percentage string
 * @param bps Basis points (e.g. 150 for 1.5%)
 * @param options Formatting options
 * @returns Formatted percentage (e.g. "1.5%")
 */
export function formatBps(
  bps: number,
  options?: { minDecimals?: number; prefix?: string; suffix?: string }
): string {
  const minDecimals = options?.minDecimals || 0;
  const prefix = options?.prefix || '';
  const suffix = options?.suffix !== undefined ? options.suffix : '%';

  const sign = bps < 0 ? '-' : '';
  const absBps = Math.abs(bps);
  const percentage = absBps / 100;
  let formatted = percentage.toString();

  if (minDecimals > 0) {
    // Optimization: Avoid creating an array with split()
    const dotIndex = formatted.indexOf('.');
    const decimals = dotIndex === -1 ? 0 : formatted.length - dotIndex - 1;
    if (decimals < minDecimals) {
      formatted = percentage.toFixed(minDecimals);
    }
  }

  return `${sign}${prefix}${formatted}${suffix}`;
}

/**
 * Calculate fee split for a mission reward
 * @param rewardAmount Total reward amount in USDC base units
 * @param guildFeeBps Guild fee in basis points (0-1500)
 * @returns Fee split breakdown
 */
export function calculateFeeSplit(
  rewardAmount: bigint,
  guildFeeBps: number = 0
): FeeSplit {
  // Validate inputs
  if (rewardAmount < 0n) {
    throw new Error('Reward amount must be non-negative');
  }
  if (guildFeeBps < 0 || guildFeeBps > FEES.MAX_GUILD_BPS) {
    throw new Error(
      `Guild fee must be between 0 and ${FEES.MAX_GUILD_BPS} bps`
    );
  }

  // Use local BigInt(10000) instead of module constant as it benchmarks significantly faster
  // in this specific function (V8 optimization quirk).
  const bpsDivisor = BigInt(10000);
  const protocolAmount = (rewardAmount * PROTOCOL_BPS_BIGINT) / bpsDivisor;
  const labsAmount = (rewardAmount * LABS_BPS_BIGINT) / bpsDivisor;
  const resolverAmount = (rewardAmount * RESOLVER_BPS_BIGINT) / bpsDivisor;
  const guildAmount = (rewardAmount * BigInt(guildFeeBps)) / bpsDivisor;
  const performerAmount =
    rewardAmount - protocolAmount - labsAmount - resolverAmount - guildAmount;

  return {
    performerAmount,
    protocolAmount,
    guildAmount,
    resolverAmount,
    labsAmount,
  };
}

/**
 * Calculate DDR (Dynamic Dispute Reserve) amount
 * @param rewardAmount Total reward amount in USDC base units
 * @returns DDR amount each party must deposit
 */
export function calculateDDR(rewardAmount: bigint): bigint {
  if (rewardAmount < 0n) {
    throw new Error('Reward amount must be non-negative');
  }
  return (rewardAmount * DDR_BPS_BIGINT) / BPS_DIVISOR;
}

/**
 * Calculate LPP (Loser-Pays Penalty) amount
 * @param rewardAmount Total reward amount in USDC base units
 * @returns LPP amount
 */
export function calculateLPP(rewardAmount: bigint): bigint {
  if (rewardAmount < 0n) {
    throw new Error('Reward amount must be non-negative');
  }
  return (rewardAmount * LPP_BPS_BIGINT) / BPS_DIVISOR;
}

/**
 * Calculate mission expiration timestamp
 * @param durationSeconds Duration in seconds
 * @returns Expiration timestamp (bigint)
 */
export function calculateExpiresAt(durationSeconds: number): bigint {
  if (!Number.isInteger(durationSeconds)) {
    throw new Error(
      `Invalid duration: ${durationSeconds} seconds. Duration must be an integer.`
    );
  }
  if (durationSeconds < MIN_DURATION || durationSeconds > MAX_DURATION) {
    throw new Error(
      `Invalid duration: ${durationSeconds} seconds. Duration must be between ${MIN_DURATION} and ${MAX_DURATION} seconds.`
    );
  }
  return BigInt(Math.floor(Date.now() / 1000) + durationSeconds);
}

/**
 * Check if a mission has expired
 * @param expiresAt Expiration timestamp
 * @returns True if expired
 */
export function isMissionExpired(expiresAt: bigint): boolean {
  // Optimization: Comparison using Number is faster and avoids BigInt allocation for current time
  // Equivalent to: BigInt(Math.floor(Date.now() / 1000)) > expiresAt
  // Safe until year 285,616 AD (Number.MAX_SAFE_INTEGER)
  return Date.now() >= (Number(expiresAt) + 1) * 1000;
}

/**
 * Convert string to bytes32 (for IPFS hashes, etc.)
 * @param str String to convert (usually hex string)
 * @returns bytes32 hex string
 */
export function toBytes32(str: string): `0x${string}` {
  // If already a hex string with 0x prefix
  if (str.startsWith('0x')) {
    const hex = str.slice(2);
    if (hex.length > 64) {
      throw new Error(
        `String too long for bytes32: ${Math.ceil(hex.length / 2)} bytes (max 32)`
      );
    }
    return `0x${hex.padEnd(64, '0')}` as `0x${string}`;
  }
  // Convert string to hex
  const bytes = TEXT_ENCODER.encode(str);
  if (bytes.length > 32) {
    throw new Error(
      `String too long for bytes32: ${bytes.length} bytes (max 32)`
    );
  }
  let hex = '';
  // Optimization: Loop with lookup table is significantly faster than Array.from().map().join()
  for (let i = 0; i < bytes.length; i++) {
    hex += HEX_STRINGS[bytes[i]];
  }
  return `0x${hex.padEnd(64, '0')}` as `0x${string}`;
}

/**
 * Generate a placeholder bytes32 hash (for testing)
 * @returns Random bytes32 hex string
 */
export function randomBytes32(): `0x${string}` {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  let hex = '';
  // Optimization: Loop with lookup table
  for (let i = 0; i < 32; i++) {
    hex += HEX_STRINGS[bytes[i]];
  }
  return `0x${hex}` as `0x${string}`;
}

/**
 * Format address for display (truncated)
 * @param address Full address
 * @param options Formatting options
 * @returns Truncated address (e.g., "0x1234...5678")
 */
export function formatAddress(
  address: string,
  options?: { start?: number; end?: number }
): string {
  if (options) {
    const start = options.start ?? 6;
    const end = options.end ?? 4;
    // If address is shorter than or equal to the truncated parts, return as is
    if (address.length <= start + end) return address;
    return `${address.slice(0, start)}...${address.slice(-end)}`;
  }

  // Legacy behavior: Only truncate if strictly 42 chars (standard EVM address)
  if (address.length !== 42) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Get BaseScan URL for address or transaction
 * @param hashOrAddress Address or transaction hash
 * @param type 'address' or 'tx'
 * @param testnet Whether to use testnet explorer
 * @returns Full BaseScan URL
 */
export function getBaseScanUrl(
  hashOrAddress: string,
  type: 'address' | 'tx' = 'address',
  testnet: boolean = true
): string {
  const baseUrl = testnet
    ? 'https://sepolia.basescan.org'
    : 'https://basescan.org';
  return `${baseUrl}/${type}/${hashOrAddress}`;
}
