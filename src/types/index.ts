// =============================================================================
// HORIZON PROTOCOL - TYPE DEFINITIONS
// =============================================================================

/**
 * Mission state enum matching on-chain values
 */
export enum MissionState {
  None = 0,
  Open = 1,
  Accepted = 2,
  Submitted = 3,
  Completed = 4,
  Cancelled = 5,
  Disputed = 6,
}

/**
 * Dispute state enum
 */
export enum DisputeState {
  None = 0,
  Pending = 1,
  Investigating = 2,
  Resolved = 3,
  Appealed = 4,
  Finalized = 5,
}

/**
 * Dispute outcome enum
 */
export enum DisputeOutcome {
  None = 0,
  PosterWins = 1,
  PerformerWins = 2,
  Split = 3,
  Cancelled = 4,
}

/**
 * Achievement category enum
 */
export enum AchievementCategory {
  Milestone = 0,
  Performance = 1,
  Guild = 2,
  Seasonal = 3,
  Special = 4,
}

/**
 * Mission parameters (immutable after creation)
 */
export interface MissionParams {
  poster: `0x${string}`;
  rewardAmount: bigint;
  createdAt: bigint;
  expiresAt: bigint;
  guild: `0x${string}`;
  metadataHash: `0x${string}`;
  locationHash: `0x${string}`;
}

/**
 * Mission runtime state (mutable)
 */
export interface MissionRuntime {
  performer: `0x${string}`;
  state: MissionState;
  proofHash: `0x${string}`;
  disputeRaised: boolean;
}

/**
 * Complete mission data
 */
export interface Mission {
  id: bigint;
  escrowAddress: `0x${string}`;
  params: MissionParams;
  runtime: MissionRuntime;
}

/**
 * Guild configuration
 */
export interface GuildConfig {
  name: string;
  admin: `0x${string}`;
  treasury: `0x${string}`;
  guildFeeBps: number;
}

/**
 * Fee split breakdown
 */
export interface FeeSplit {
  performerAmount: bigint;
  protocolAmount: bigint;
  guildAmount: bigint;
  resolverAmount: bigint;
  labsAmount: bigint;
}

/**
 * Rating data
 */
export interface Rating {
  score: number;
  commentHash: `0x${string}`;
  timestamp: bigint;
}

/**
 * Achievement type definition
 */
export interface AchievementType {
  typeId: bigint;
  name: string;
  description: string;
  category: AchievementCategory;
  isSoulbound: boolean;
  isActive: boolean;
  maxSupply: bigint;
  currentSupply: bigint;
  baseTokenURI: string;
  xpReward: bigint;
}

/**
 * Network configuration
 */
export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  contracts: ContractAddresses;
}

/**
 * Contract addresses for a network
 */
export interface ContractAddresses {
  paymentRouter: `0x${string}`;
  missionFactory: `0x${string}`;
  guildFactory: `0x${string}`;
  reputationAttestations: `0x${string}`;
  disputeResolver: `0x${string}`;
  achievements: `0x${string}`;
  usdc: `0x${string}`;
}

/**
 * Create mission parameters
 */
export interface CreateMissionParams {
  rewardAmount: bigint;
  expiresAt: bigint;
  guild?: `0x${string}`;
  metadataHash: `0x${string}`;
  locationHash: `0x${string}`;
}

/**
 * Create guild parameters
 */
export interface CreateGuildParams {
  name: string;
  treasury: `0x${string}`;
  guildFeeBps: number;
}




