// =============================================================================
// HORIZON PROTOCOL - UTILITY FUNCTIONS
// =============================================================================

import { USDC_DECIMALS, FEES } from '../constants';
import type { FeeSplit } from '../types';

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
  const divisor = BigInt(10 ** USDC_DECIMALS);
  const whole = amount / divisor;
  const fraction = amount % divisor;
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

  const bpsDivisor = BigInt(10000);

  const protocolAmount = (rewardAmount * BigInt(FEES.PROTOCOL_BPS)) / bpsDivisor;
  const labsAmount = (rewardAmount * BigInt(FEES.LABS_BPS)) / bpsDivisor;
  const resolverAmount = (rewardAmount * BigInt(FEES.RESOLVER_BPS)) / bpsDivisor;
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
  return (rewardAmount * BigInt(FEES.DDR_BPS)) / BigInt(10000);
}

/**
 * Calculate LPP (Loser-Pays Penalty) amount
 * @param rewardAmount Total reward amount in USDC base units
 * @returns LPP amount
 */
export function calculateLPP(rewardAmount: bigint): bigint {
  return (rewardAmount * BigInt(FEES.LPP_BPS)) / BigInt(10000);
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
  const hex = Buffer.from(str).toString('hex').padEnd(64, '0');
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




