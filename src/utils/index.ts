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

// Maximum allowed decimals for formatting to prevent DoS
const MAX_DECIMALS = 100;

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

// Performance optimization: Hoisted constants for compact USDC formatting
const COMPACT_ONE_THOUSAND = 1000n * USDC_MULTIPLIER_BIGINT;
const COMPACT_ONE_MILLION = 1000000n * USDC_MULTIPLIER_BIGINT;
const COMPACT_ONE_BILLION = 1000000000n * USDC_MULTIPLIER_BIGINT;
const COMPACT_ONE_TRILLION = 1000000000000n * USDC_MULTIPLIER_BIGINT;

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

// Performance optimization: Shared buffer for randomBytes32 to avoid allocation on every call
const RANDOM_BYTES_BUFFER = new Uint8Array(32);

// Performance optimization: Hoisted regex for getBaseScanUrl
const HEX_REGEX = /^0x[0-9a-fA-F]+$/;

// Performance optimization: Hoisted time units for formatDuration
const TIME_UNITS_SHORT = [
  { label: 'd', seconds: 86400 },
  { label: 'h', seconds: 3600 },
  { label: 'm', seconds: 60 },
  { label: 's', seconds: 1 },
];

const TIME_UNITS_LONG = [
  { label: 'day', seconds: 86400 },
  { label: 'hour', seconds: 3600 },
  { label: 'minute', seconds: 60 },
  { label: 'second', seconds: 1 },
];

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
  if (len === 0) throw new Error('Invalid USDC amount format');
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
      if (dotIndex !== -1) throw new Error('Invalid USDC amount format: Multiple decimal points found.');
      dotIndex = i;
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
    throw new Error('Invalid USDC amount format');
  }

  const fracLen = fractionPartStr.length;
  if (fracLen > USDC_DECIMALS) {
    throw new Error(`Too many decimals (max ${USDC_DECIMALS})`);
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

    if (absAmount >= COMPACT_ONE_TRILLION) {
      divisor = COMPACT_ONE_TRILLION;
      unit = 'T';
    } else if (absAmount >= COMPACT_ONE_BILLION) {
      divisor = COMPACT_ONE_BILLION;
      unit = 'B';
    } else if (absAmount >= COMPACT_ONE_MILLION) {
      divisor = COMPACT_ONE_MILLION;
      unit = 'M';
    } else if (absAmount >= COMPACT_ONE_THOUSAND) {
      divisor = COMPACT_ONE_THOUSAND;
      unit = 'K';
    }

    if (unit) {
      // Calculate scaled amount with higher precision for formatting
      // We want to keep up to 2 decimals for compact notation by default
      const scaledWhole = absAmount / divisor;
      const remainder = absAmount % divisor;

      let decimalPart = '';
      if (remainder > 0n) {
        // Calculate fractional part (simulate 2 decimal places for compact)
        // Optimization: Use pure numeric operations to format decimals instead of strings/padding
        const fractionVal = Number((remainder * 100n) / divisor);

        if (fractionVal > 0) {
          if (fractionVal < 10) {
            decimalPart = `.0${fractionVal}`;
          } else if (fractionVal % 10 === 0) {
            decimalPart = `.${fractionVal / 10}`;
          } else {
            decimalPart = `.${fractionVal}`;
          }
        }
      }

      const sign = amount < 0n ? '-' : '';
      return `${sign}${prefix}${scaledWhole}${decimalPart}${unit}${suffix}`;
    }
  }

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
      // Optimization: substring is faster than slice, and direct string concatenation
      // is faster than template literals for simple joins.
      const mod = len % 3;
      const start = mod === 0 ? 3 : mod;
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
  if (!Number.isFinite(bps)) {
    throw new Error('Basis points must be a finite number');
  }

  let minDecimals = options?.minDecimals || 0;
  if (minDecimals > MAX_DECIMALS) minDecimals = MAX_DECIMALS;
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
  if (!Number.isInteger(guildFeeBps)) {
    throw new Error('Guild fee must be an integer');
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

  // Optimization: Avoid redundant calculation if BPS values are identical
  const labsAmount = (LABS_BPS_BIGINT === PROTOCOL_BPS_BIGINT)
    ? protocolAmount
    : (rewardAmount * LABS_BPS_BIGINT) / bpsDivisor;

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
  if (!Number.isFinite(durationSeconds)) {
    throw new Error(
      `Invalid duration: ${durationSeconds} seconds. Duration must be a finite number.`
    );
  }
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
 * Format duration in seconds to human-readable string
 * @param seconds Duration in seconds
 * @param options Formatting options
 * @returns Formatted duration string (e.g. "1h 30m")
 */
export function formatDuration(
  seconds: number,
  options?: { style?: 'short' | 'long' }
): string {
  if (!Number.isFinite(seconds)) throw new Error('Duration must be a finite number');
  if (seconds < 0) throw new Error('Duration must be non-negative');
  if (!Number.isInteger(seconds)) throw new Error('Duration must be an integer');

  const isLong = options?.style === 'long';
  if (seconds === 0) return isLong ? '0 seconds' : '0s';

  // Optimization: Use hoisted constants to avoid array allocation on every call
  const timeUnits = isLong ? TIME_UNITS_LONG : TIME_UNITS_SHORT;

  let result = '';
  let remainingSeconds = seconds;

  // Optimization: standard for loop and direct string concatenation
  // without Array.push().join() or template literals
  for (let i = 0; i < timeUnits.length; i++) {
    const unit = timeUnits[i];
    const unitSeconds = unit.seconds;

    // integer division
    const count = Math.floor(remainingSeconds / unitSeconds);
    if (count > 0) {
      if (result.length > 0) {
        result += ' ';
      }

      if (isLong) {
        result += count + ' ' + unit.label + (count > 1 ? 's' : '');
      } else {
        result += count + unit.label;
      }

      remainingSeconds %= unitSeconds;
    }
  }

  return result;
}

/**
 * Convert string to bytes32 (for IPFS hashes, etc.)
 * @param str String to convert (usually hex string)
 * @returns bytes32 hex string
 */
export function toBytes32(str: string): `0x${string}` {
  const len = str.length;
  // If already a hex string with 0x prefix
  if (len >= 2 && str.charCodeAt(0) === 48 && str.charCodeAt(1) === 120) { // '0x'
    const hexLen = len - 2;
    if (hexLen > 64) {
      throw new Error(
        `String too long for bytes32: ${Math.ceil(hexLen / 2)} bytes (max 32)`
      );
    }

    // Optimization: avoid regex and check chars directly to prevent string allocation for substring just for validation
    for (let i = 2; i < len; i++) {
        const charCode = str.charCodeAt(i);
        if (!(charCode >= 48 && charCode <= 57) && // 0-9
            !(charCode >= 97 && charCode <= 102) && // a-f
            !(charCode >= 65 && charCode <= 70)) {    // A-F
            throw new Error('Invalid hex string.');
        }
    }
    return `0x${str.substring(2).padEnd(64, '0')}` as `0x${string}`;
  }
  // Convert string to hex
  const bytes = TEXT_ENCODER.encode(str);
  const bytesLen = bytes.length;
  if (bytesLen > 32) {
    throw new Error(
      `String too long for bytes32: ${bytesLen} bytes (max 32)`
    );
  }
  let hex = '';
  // Optimization: Loop with lookup table is significantly faster than Array.from().map().join()
  for (let i = 0; i < bytesLen; i++) {
    hex += HEX_STRINGS[bytes[i]];
  }
  return `0x${hex.padEnd(64, '0')}` as `0x${string}`;
}

/**
 * Generate a placeholder bytes32 hash (for testing)
 * @returns Random bytes32 hex string
 */
export function randomBytes32(): `0x${string}` {
  crypto.getRandomValues(RANDOM_BYTES_BUFFER);
  let hex = '';
  // Optimization: Loop with lookup table
  for (let i = 0; i < 32; i++) {
    hex += HEX_STRINGS[RANDOM_BYTES_BUFFER[i]];
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
  const len = address.length;
  if (options) {
    const start = options.start ?? 6;
    const end = options.end ?? 4;
    // If address is shorter than or equal to the truncated parts, return as is
    if (len <= start + end) return address;

    // Optimization: substring and string concatenation is faster than slice and template literals
    const endStr = end === 0 ? '' : address.substring(len - end);
    return address.substring(0, start) + '...' + endStr;
  }

  // Legacy behavior: Only truncate if strictly 42 chars (standard EVM address)
  if (len !== 42) return address;
  return address.substring(0, 6) + '...' + address.substring(38);
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
  type?: 'address' | 'tx',
  testnet: boolean = true
): string {
  // Security: Strict validation to prevent path traversal and XSS
  // Only allow valid 0x-prefixed hex strings of correct length (42 for address, 66 for tx)
  // Optimization: Fast O(1) string length check avoids regex engine overhead
  const len = hashOrAddress.length;
  if (len !== 42 && len !== 66) {
    throw new Error('Invalid address or transaction hash.');
  }

  if (!HEX_REGEX.test(hashOrAddress)) {
    throw new Error('Invalid address or transaction hash.');
  }

  const baseUrl = testnet
    ? 'https://sepolia.basescan.org'
    : 'https://basescan.org';

  let resolvedType = type;
  if (!resolvedType) {
    resolvedType = len === 66 ? 'tx' : 'address';
  } else if (resolvedType !== 'address' && resolvedType !== 'tx') {
    throw new Error('Invalid type: must be "address" or "tx".');
  }

  return `${baseUrl}/${resolvedType}/${hashOrAddress}`;
}
