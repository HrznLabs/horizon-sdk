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

/**
 * Parse USDC amount from human-readable string to bigint
 * @param amount Human-readable amount (e.g., "10.50")
 * @returns Amount in USDC base units (bigint)
 */
export function parseUSDC(amount: string | number): bigint {
  let numAmount: number;

  if (typeof amount === 'string') {
    const str = amount.trim();
    if (!str) throw new Error(`Invalid USDC amount: "${amount}"`);

    // Strict validation for decimal format
    // Allows: "10", "10.5", ".5", "-10", "-.5"
    // Disallows: "10abc", "10.5.5", "1,5", "", " "
    const regex = /^-?(?:\d+(?:\.\d*)?|\.\d+)$/;
    if (!regex.test(str)) {
      throw new Error(`Invalid USDC amount: "${amount}"`);
    }
    numAmount = parseFloat(str);
  } else {
    numAmount = amount;
  }

  if (!Number.isFinite(numAmount)) {
    throw new Error(`Invalid USDC amount: "${amount}"`);
  }

  return BigInt(Math.round(numAmount * USDC_MULTIPLIER_NUM));
}

/**
 * Format USDC amount from bigint to human-readable string
 * @param amount Amount in USDC base units
 * @returns Human-readable amount string
 */
export function formatUSDC(amount: bigint): string {
  const whole = amount / USDC_MULTIPLIER_BIGINT;
  const fraction = amount % USDC_MULTIPLIER_BIGINT;
  const fractionStr = fraction.toString().padStart(USDC_DECIMALS, '0');
  return `${whole}.${fractionStr}`;
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
    const hex = str.slice(2).padEnd(64, '0');
    return `0x${hex}` as `0x${string}`;
  }
  // Convert string to hex
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .padEnd(64, '0');
  return `0x${hex}` as `0x${string}`;
}

/**
 * Generate a placeholder bytes32 hash (for testing)
 * @returns Random bytes32 hex string
 */
export function randomBytes32(): `0x${string}` {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
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
