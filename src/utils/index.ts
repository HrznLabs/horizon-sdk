// =============================================================================
// HORIZON PROTOCOL - UTILITY FUNCTIONS
// =============================================================================

import { USDC_DECIMALS, FEES } from '../constants';
import type { FeeSplit } from '../types';

const BPS_DIVISOR = BigInt(10000);
const USDC_DIVISOR = BigInt(10 ** USDC_DECIMALS);

/**
 * Parse USDC amount from human-readable string to bigint
 * @param amount Human-readable amount (e.g., "10.50")
 * @returns Amount in USDC base units (bigint)
 */
export function parseUSDC(amount: string | number): bigint {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return BigInt(Math.round(numAmount * 10 ** USDC_DECIMALS));
}

/**
 * Format USDC amount from bigint to human-readable string
 * @param amount Amount in USDC base units
 * @returns Human-readable amount string
 */
export function formatUSDC(amount: bigint): string {
  const whole = amount / USDC_DIVISOR;
  const fraction = amount % USDC_DIVISOR;
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
  if (rewardAmount < 0n) {
    throw new Error('Reward amount cannot be negative');
  }
  if (guildFeeBps < 0 || guildFeeBps > FEES.MAX_GUILD_BPS) {
    throw new Error(
      `Guild fee must be between 0 and ${FEES.MAX_GUILD_BPS} basis points`
    );
  }

  const protocolAmount = (rewardAmount * BigInt(FEES.PROTOCOL_BPS)) / BPS_DIVISOR;
  const labsAmount = (rewardAmount * BigInt(FEES.LABS_BPS)) / BPS_DIVISOR;
  const resolverAmount = (rewardAmount * BigInt(FEES.RESOLVER_BPS)) / BPS_DIVISOR;
  const guildAmount = (rewardAmount * BigInt(guildFeeBps)) / BPS_DIVISOR;
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
  return (rewardAmount * BigInt(FEES.DDR_BPS)) / BPS_DIVISOR;
}

/**
 * Calculate LPP (Loser-Pays Penalty) amount
 * @param rewardAmount Total reward amount in USDC base units
 * @returns LPP amount
 */
export function calculateLPP(rewardAmount: bigint): bigint {
  return (rewardAmount * BigInt(FEES.LPP_BPS)) / BPS_DIVISOR;
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
  // Convert string to hex - isomorphic approach using TextEncoder
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

/**
 * Format duration in seconds to human-readable string (e.g., "2d 4h", "1h 30m")
 * @param seconds Duration in seconds
 * @returns Formatted string
 */
export function formatDuration(seconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  if (totalSeconds === 0) return '0s';

  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (days > 0) {
    return `${days}d${hours > 0 ? ` ${hours}h` : ''}`;
  }
  if (hours > 0) {
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
  }
  if (minutes > 0) {
    return `${minutes}m${secs > 0 ? ` ${secs}s` : ''}`;
  }
  return `${secs}s`;
}
