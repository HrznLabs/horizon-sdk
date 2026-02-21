// =============================================================================
// HORIZON PROTOCOL - CONSTANTS
// =============================================================================

import type { NetworkConfig, ContractAddresses } from './types';

/**
 * USDC decimals (6)
 */
export const USDC_DECIMALS = 6;

/**
 * HRZN token decimals (18)
 */
export const HRZN_DECIMALS = 18;

/**
 * Minimum mission reward (1 USDC)
 */
export const MIN_REWARD = BigInt(1_000_000); // 1e6

/**
 * Maximum mission reward (100,000 USDC)
 */
export const MAX_REWARD = BigInt(100_000_000_000); // 100_000e6

/**
 * Minimum mission duration (1 hour in seconds)
 */
export const MIN_DURATION = 3600;

/**
 * Maximum mission duration (30 days in seconds)
 */
export const MAX_DURATION = 30 * 24 * 3600;

/**
 * Fee structure in basis points (1 bp = 0.01%)
 */
export const FEES = {
  /** Protocol fee: 2.5% */
  PROTOCOL_BPS: 250,
  /** Labs fee: 2.5% */
  LABS_BPS: 250,
  /** SubDAO fee: 2% */
  SUBDAO_BPS: 200,
  /** MetaDAO fee: 0.5% */
  METADAO_BPS: 50,
  /** Resolver fee: 2% */
  RESOLVER_BPS: 200,
  /** Maximum guild fee: 15% */
  MAX_GUILD_BPS: 1500,
  /** Base performer percentage: 90% */
  BASE_PERFORMER_BPS: 9000,
  /** DDR (Dynamic Dispute Reserve) rate: 5% */
  DDR_BPS: 500,
  /** LPP (Loser-Pays Penalty) rate: 2% */
  LPP_BPS: 200,
} as const;

/**
 * Appeal period in seconds (48 hours)
 */
export const APPEAL_PERIOD = 48 * 3600;

/**
 * Zero address constant
 */
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as const;

/**
 * Base Sepolia testnet contract addresses (v2.2 deployment)
 */
export const BASE_SEPOLIA_CONTRACTS: ContractAddresses = {
  paymentRouter: '0x94fb7908257ec36f701d2605b51eefed4326ddf5',
  missionFactory: '0xee9234954b134c39c17a75482da78e46b16f466c',
  guildFactory: '0xfeae3538a4a1801e47b6d16104aa8586edb55f00',
  reputationAttestations: '0xedae9682a0fb6fb3c18d6865461f67db7d748002',
  disputeResolver: '0xb00ac4278129928aecc72541b0bcd69d94c1691e',
  achievements: '0x568e0e3102bfa1f4045d3f62559c0f9823b469bc',
  usdc: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  // M5 Token Economics — deployed 2026-02-21
  horizonToken: '0xE6044147c8Af0206b027d845eD8E62796C95e092' as `0x${string}`,
  sHRZNVault: '0x4f7d551a2482Ba27c7477fEdF62b491DE3156aB6' as `0x${string}`,
  feeDistributor: '0x4f1b954A293c36C762F81276357c8Dd8438485BC' as `0x${string}`,
  horizonVesting: '0xa7F10148D14cb3D8459ebf94A64E4e05F4bB95f4' as `0x${string}`,
  horizonGovernor: '0x4246b5d58960D796F3d562A3ECE333f51e2bFdCc' as `0x${string}`,
  horizonTimelock: '0xBB50b9987e93E831Fd1C0C54c2C952bF5B7D87d7' as `0x${string}`,
};

/**
 * Base Sepolia network configuration
 */
export const BASE_SEPOLIA: NetworkConfig = {
  chainId: 84532,
  name: 'Base Sepolia',
  rpcUrl: 'https://sepolia.base.org',
  blockExplorer: 'https://sepolia.basescan.org',
  contracts: BASE_SEPOLIA_CONTRACTS,
};

/**
 * Base Mainnet contract addresses (not yet deployed)
 */
export const BASE_MAINNET_CONTRACTS: ContractAddresses = {
  paymentRouter: '0x0000000000000000000000000000000000000000',
  missionFactory: '0x0000000000000000000000000000000000000000',
  guildFactory: '0x0000000000000000000000000000000000000000',
  reputationAttestations: '0x0000000000000000000000000000000000000000',
  disputeResolver: '0x0000000000000000000000000000000000000000',
  achievements: '0x0000000000000000000000000000000000000000',
  usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base mainnet USDC
  // M5 Token Economics (addresses to be filled after mainnet deploy)
  horizonToken: '' as `0x${string}`,
  sHRZNVault: '' as `0x${string}`,
  feeDistributor: '' as `0x${string}`,
  horizonVesting: '' as `0x${string}`,
  horizonGovernor: '' as `0x${string}`,
  horizonTimelock: '' as `0x${string}`,
};

/**
 * Base Mainnet network configuration
 */
export const BASE_MAINNET: NetworkConfig = {
  chainId: 8453,
  name: 'Base',
  rpcUrl: 'https://mainnet.base.org',
  blockExplorer: 'https://basescan.org',
  contracts: BASE_MAINNET_CONTRACTS,
};

/**
 * All supported networks
 */
export const NETWORKS = {
  [BASE_SEPOLIA.chainId]: BASE_SEPOLIA,
  [BASE_MAINNET.chainId]: BASE_MAINNET,
} as const;

/**
 * Get network configuration by chain ID
 */
export function getNetwork(chainId: number): NetworkConfig | undefined {
  return NETWORKS[chainId as keyof typeof NETWORKS];
}

/**
 * Get contract addresses by chain ID
 */
export function getContracts(chainId: number): ContractAddresses | undefined {
  return getNetwork(chainId)?.contracts;
}




