// =============================================================================
// HORIZON PROTOCOL SDK
// =============================================================================
//
// SDK for integrating with Horizon Protocol - decentralized mission
// coordination on Base.
//
// Usage:
//   import { BASE_SEPOLIA, MissionFactoryABI, parseUSDC } from '@horizon-protocol/sdk';
//
// =============================================================================

// ABIs
export {
  MissionFactoryABI,
  MissionEscrowABI,
  GuildFactoryABI,
  GuildDAOABI,
  PaymentRouterABI,
  ReputationAttestationsABI,
  HorizonAchievementsABI,
  ERC20ABI,
} from './abis';

// Types
export {
  MissionState,
  DisputeState,
  DisputeOutcome,
  AchievementCategory,
  type MissionParams,
  type MissionRuntime,
  type Mission,
  type GuildConfig,
  type FeeSplit,
  type Rating,
  type AchievementType,
  type NetworkConfig,
  type ContractAddresses,
  type CreateMissionParams,
  type CreateGuildParams,
} from './types';

// Constants
export {
  USDC_DECIMALS,
  MIN_REWARD,
  MAX_REWARD,
  MIN_DURATION,
  MAX_DURATION,
  FEES,
  APPEAL_PERIOD,
  ZERO_ADDRESS,
  BASE_SEPOLIA_CONTRACTS,
  BASE_SEPOLIA,
  BASE_MAINNET_CONTRACTS,
  BASE_MAINNET,
  NETWORKS,
  getNetwork,
  getContracts,
} from './constants';

// Utilities
export {
  parseUSDC,
  formatUSDC,
  formatBps,
  calculateFeeSplit,
  calculateDDR,
  calculateLPP,
  calculateExpiresAt,
  isMissionExpired,
  toBytes32,
  randomBytes32,
  formatAddress,
  getBaseScanUrl,
} from './utils';




