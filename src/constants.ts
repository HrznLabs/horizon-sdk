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

// Last synced: 2026-05-10 from monorepo packages/shared/src/constants/index.ts (Phase 13 redeploy 2026-03-10)
/**
 * Base Sepolia testnet contract addresses (Phase 13 redeployment 2026-03-10)
 */
export const BASE_SEPOLIA_CONTRACTS: ContractAddresses = {
  // Core v2.2
  missionFactory: '0x6d97964E9BE016A8AABA2f99F0bA419464Fb88D9',
  paymentRouter: '0x3013db6C92EF956f86EBC0aDFECe70b80FA73600',
  missionEscrowImpl: '0x3b02a7eac30Bc4a800Eebd69Fed75c818dB92099',
  guildFactory: '0x7349Cd1A4f7C1a74Db730743d873de98A2f3a32F',
  disputeResolver: '0xdE37Ff10A487c852941DC842987dd8d5d8b9E855',
  achievements: '0xfCC5971C3704C7a1F1c9E4acFdC7eEd60D4e4949',
  // Tokens
  usdc: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  eurc: '0x808456652fdb597867f38412077A9182bf77359F',
  // M5 Token Economics — deployed 2026-02-21
  horizonToken: '0xe4f29a413c24B6020FE344C412D9f82Df15809aF',
  sHRZNVault: '0xf3D693616d6b185b36D4a2e36663E5932d351758',
  feeDistributor: '0x75F875D3c1d01F9A31C7Bd85A5098bD9448b6440',
  horizonGovernor: '0xE52CCaa9980f0aD00F48BebCbB7294c3c5F644A7',
  governorTimelock: '0xD0112d484B3261b26D8721e074dC82866A85977C',
  buybackExecutor: '0x57Bad3A5871BAEAB2e8aee1D5017Aa272f6564FA',
  teamVesting: '0x7ce88218e511af2A676d5e9992D985BCa067F284',
  advisorVesting: '0x2483829bd61Da59dF3eD728aE8Db778a7Af9eca7',
  // iTake Vertical — deployed 2026-02-19
  iTakeGuildFactory: '0xB54795f8049De1acf729160bcD9184e50E4f267E',
  iTakePaymentRouter: '0x539408777865c7a3Ac702a350BEb4C04b8618eF2',
  reputationOracle: '0x7b2617a841B1c3c39Bba454387167A8948301CA8',
  deliveryMissionFactory: '0x77DD51c63A3fEE0442f4383B5a9D91d470BD04F5',
  deliveryEscrowImpl: '0x21Fd1D6f66BFf3B084FdA428C75b659A46446f4b',
  deliveriesDAO: '0xaB2F7787b72FcFfEA8E543375FE2db44D9C6ae53',
  iTakeMetaDAO: '0x883B7D8CA234912B82AC9718664c2dF224c98a67',
  atobaDAO: '0x85fB5f85FeC3c18a47e21f22AB69A9bBB09d913f',
  lisboacafe: '0xAA0096E1038449220dB872c19BDF9CD6d619b7BA',
  // Treasuries (shared address)
  protocolDAO: '0x2b30efBA367D669c9cd7723587346a79b67A42DB',
  resolversDAO: '0x2b30efBA367D669c9cd7723587346a79b67A42DB',
  labsDAO: '0x2b30efBA367D669c9cd7723587346a79b67A42DB',
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
  // Core v2.2 (pending mainnet deploy)
  paymentRouter: '0x0000000000000000000000000000000000000000',
  missionFactory: '0x0000000000000000000000000000000000000000',
  missionEscrowImpl: '0x0000000000000000000000000000000000000000',
  guildFactory: '0x0000000000000000000000000000000000000000',
  disputeResolver: '0x0000000000000000000000000000000000000000',
  achievements: '0x0000000000000000000000000000000000000000',
  // Tokens
  usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base mainnet USDC
  eurc: '0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42', // Base mainnet EURC
  // M5 Token Economics (addresses to be filled after mainnet deploy)
  horizonToken: '' as `0x${string}`,
  sHRZNVault: '' as `0x${string}`,
  feeDistributor: '' as `0x${string}`,
  horizonGovernor: '' as `0x${string}`,
  governorTimelock: '' as `0x${string}`,
  buybackExecutor: '' as `0x${string}`,
  teamVesting: '' as `0x${string}`,
  advisorVesting: '' as `0x${string}`,
  // iTake Vertical (pending mainnet deploy)
  iTakeGuildFactory: '' as `0x${string}`,
  iTakePaymentRouter: '' as `0x${string}`,
  reputationOracle: '' as `0x${string}`,
  deliveryMissionFactory: '' as `0x${string}`,
  deliveryEscrowImpl: '' as `0x${string}`,
  deliveriesDAO: '' as `0x${string}`,
  iTakeMetaDAO: '' as `0x${string}`,
  atobaDAO: '' as `0x${string}`,
  lisboacafe: '' as `0x${string}`,
  // Treasuries (pending mainnet deploy)
  protocolDAO: '' as `0x${string}`,
  resolversDAO: '' as `0x${string}`,
  labsDAO: '' as `0x${string}`,
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




