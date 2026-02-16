// =============================================================================
// HORIZON PROTOCOL - UTILITY FUNCTIONS
// =============================================================================

import { USDC_DECIMALS, FEES } from '../constants';
import type { FeeSplit } from '../types';

// Pre-calculated constants to improve performance
const BPS_DIVISOR = BigInt(10000);
const USDC_MULTIPLIER_NUM = 10 ** USDC_DECIMALS;
const USDC_MULTIPLIER_BIGINT = BigInt(USDC_MULTIPLIER_NUM);

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
    return BigInt(Math.round(amount * USDC_MULTIPLIER_NUM));
  }

  const len = amount.length;
  if (len === 0) throw new Error(`Invalid USDC amount format: "${amount}"`);

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
    if (code === 46) { // '.'
      if (dotIndex !== -1) throw new Error(`Invalid USDC amount format: "${amount}". Multiple decimal points found.`);
      dotIndex = i;
    } else if (code === 44) { // ','
      throw new Error(`Invalid USDC amount format: "${amount}". Commas are not allowed, please remove thousands separators.`);
    } else if (code === 36) { // '$'
      throw new Error(`Invalid USDC amount format: "${amount}". Currency symbols are not allowed.`);
    } else if (code === 32) { // ' '
      throw new Error(`Invalid USDC amount format: "${amount}". Spaces are not allowed.`);
    } else if (code < 48 || code > 57) { // not digit '0'-'9'
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

  if (fractionPartStr.length > USDC_DECIMALS) {
    throw new Error(`Too many decimals: "${amount}" (max ${USDC_DECIMALS})`);
  }

  const intStr = integerPartStr || "0";
  const fracStr = fractionPartStr.padEnd(USDC_DECIMALS, '0');

  const val = BigInt(intStr + fracStr);
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
  options?: { minDecimals?: number }
): string {
  const minDecimals = options?.minDecimals || 0;

  const absAmount = amount < 0n ? -amount : amount;
  const whole = absAmount / USDC_MULTIPLIER_BIGINT;
  const fraction = absAmount % USDC_MULTIPLIER_BIGINT;

  let fractionStr = fraction.toString().padStart(USDC_DECIMALS, '0');

  // Trim trailing zeros for cleaner display
  fractionStr = fractionStr.replace(/0+$/, '');

  if (minDecimals > 0) {
    fractionStr = fractionStr.padEnd(minDecimals, '0');
  }

  const sign = amount < 0n ? '-' : '';

  // Performance optimization: Manual comma insertion is ~2.7x faster than toLocaleString
  let wholeStr = whole.toString();
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

  if (fractionStr === '') {
    return `${sign}${wholeStr}`;
  }

  return `${sign}${wholeStr}.${fractionStr}`;
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
  return (rewardAmount * DDR_BPS_BIGINT) / BPS_DIVISOR;
}

/**
 * Calculate LPP (Loser-Pays Penalty) amount
 * @param rewardAmount Total reward amount in USDC base units
 * @returns LPP amount
 */
export function calculateLPP(rewardAmount: bigint): bigint {
  return (rewardAmount * LPP_BPS_BIGINT) / BPS_DIVISOR;
}

/**
 * Calculate mission expiration timestamp
 * @param durationSeconds Duration in seconds
 * @returns Expiration timestamp (bigint)
 */
export function calculateExpiresAt(durationSeconds: number): bigint {
  return BigInt(Math.floor(Date.now() / 1000) + durationSeconds);
}

/**
 * Check if a mission has expired
 * @param expiresAt Expiration timestamp
 * @returns True if expired
 */
export function isMissionExpired(expiresAt: bigint): boolean {
  return BigInt(Math.floor(Date.now() / 1000)) > expiresAt;
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
 * @returns Truncated address (e.g., "0x1234...5678")
 */
export function formatAddress(address: string): string {
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
