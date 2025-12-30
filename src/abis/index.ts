// =============================================================================
// HORIZON PROTOCOL - CONTRACT ABIs
// =============================================================================

/**
 * MissionFactory ABI
 * Factory contract for deploying MissionEscrow clones using EIP-1167 minimal proxies
 */
export const MissionFactoryABI = [
  {
    type: 'constructor',
    inputs: [
      { name: '_usdc', type: 'address' },
      { name: '_paymentRouter', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'createMission',
    inputs: [
      { name: 'rewardAmount', type: 'uint256' },
      { name: 'expiresAt', type: 'uint256' },
      { name: 'guild', type: 'address' },
      { name: 'metadataHash', type: 'bytes32' },
      { name: 'locationHash', type: 'bytes32' },
    ],
    outputs: [{ name: 'missionId', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getMission',
    inputs: [{ name: 'missionId', type: 'uint256' }],
    outputs: [{ name: 'escrow', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getMissionParams',
    inputs: [{ name: 'missionId', type: 'uint256' }],
    outputs: [
      {
        name: 'params',
        type: 'tuple',
        components: [
          { name: 'poster', type: 'address' },
          { name: 'rewardAmount', type: 'uint256' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'expiresAt', type: 'uint256' },
          { name: 'guild', type: 'address' },
          { name: 'metadataHash', type: 'bytes32' },
          { name: 'locationHash', type: 'bytes32' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getMissionRuntime',
    inputs: [{ name: 'missionId', type: 'uint256' }],
    outputs: [
      {
        name: 'runtime',
        type: 'tuple',
        components: [
          { name: 'performer', type: 'address' },
          { name: 'state', type: 'uint8' },
          { name: 'proofHash', type: 'bytes32' },
          { name: 'disputeRaised', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'missionCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'missions',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'MissionCreated',
    inputs: [
      { name: 'id', type: 'uint256', indexed: true },
      { name: 'poster', type: 'address', indexed: true },
      { name: 'escrow', type: 'address', indexed: false },
      { name: 'reward', type: 'uint256', indexed: false },
      { name: 'expiresAt', type: 'uint256', indexed: false },
      { name: 'metadataHash', type: 'bytes32', indexed: false },
      { name: 'guild', type: 'address', indexed: false },
      { name: 'locationHash', type: 'bytes32', indexed: false },
    ],
  },
] as const;

/**
 * MissionEscrow ABI
 * Individual escrow contract for each mission with full lifecycle management
 */
export const MissionEscrowABI = [
  {
    type: 'function',
    name: 'acceptMission',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'submitProof',
    inputs: [{ name: 'proofHash', type: 'bytes32' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'approveCompletion',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'cancelMission',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'raiseDispute',
    inputs: [{ name: 'disputeHash', type: 'bytes32' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'claimExpired',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'settleDispute',
    inputs: [
      { name: 'outcome', type: 'uint8' },
      { name: 'splitPercentage', type: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getParams',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'poster', type: 'address' },
          { name: 'rewardAmount', type: 'uint256' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'expiresAt', type: 'uint256' },
          { name: 'guild', type: 'address' },
          { name: 'metadataHash', type: 'bytes32' },
          { name: 'locationHash', type: 'bytes32' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getRuntime',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'performer', type: 'address' },
          { name: 'state', type: 'uint8' },
          { name: 'proofHash', type: 'bytes32' },
          { name: 'disputeRaised', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getMissionId',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'MissionAccepted',
    inputs: [
      { name: 'id', type: 'uint256', indexed: true },
      { name: 'performer', type: 'address', indexed: true },
    ],
  },
  {
    type: 'event',
    name: 'MissionSubmitted',
    inputs: [
      { name: 'id', type: 'uint256', indexed: true },
      { name: 'proofHash', type: 'bytes32', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'MissionCompleted',
    inputs: [{ name: 'id', type: 'uint256', indexed: true }],
  },
  {
    type: 'event',
    name: 'MissionCancelled',
    inputs: [{ name: 'id', type: 'uint256', indexed: true }],
  },
  {
    type: 'event',
    name: 'MissionDisputed',
    inputs: [
      { name: 'id', type: 'uint256', indexed: true },
      { name: 'by', type: 'address', indexed: true },
      { name: 'disputeHash', type: 'bytes32', indexed: false },
    ],
  },
] as const;

/**
 * GuildFactory ABI
 * Factory for deploying GuildDAO clones
 */
export const GuildFactoryABI = [
  {
    type: 'constructor',
    inputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'createGuild',
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'treasury', type: 'address' },
      { name: 'guildFeeBps', type: 'uint16' },
    ],
    outputs: [
      { name: 'guildId', type: 'uint256' },
      { name: 'guild', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getGuild',
    inputs: [{ name: 'guildId', type: 'uint256' }],
    outputs: [{ name: 'guild', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isValidGuild',
    inputs: [{ name: 'guild', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'guildCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'GuildCreated',
    inputs: [
      { name: 'id', type: 'uint256', indexed: true },
      { name: 'guild', type: 'address', indexed: true },
      { name: 'admin', type: 'address', indexed: true },
      { name: 'name', type: 'string', indexed: false },
    ],
  },
] as const;

/**
 * GuildDAO ABI
 * Guild governance contract for mission curation and member management
 */
export const GuildDAOABI = [
  {
    type: 'function',
    name: 'addMember',
    inputs: [{ name: 'member', type: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'removeMember',
    inputs: [{ name: 'member', type: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'grantCuratorRole',
    inputs: [{ name: 'member', type: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'grantOfficerRole',
    inputs: [{ name: 'member', type: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'publishToBoard',
    inputs: [{ name: 'missionId', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'isMember',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isCurator',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getConfig',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'name', type: 'string' },
          { name: 'admin', type: 'address' },
          { name: 'treasury', type: 'address' },
          { name: 'guildFeeBps', type: 'uint16' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'memberCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'GuildMemberAdded',
    inputs: [
      { name: 'guild', type: 'address', indexed: true },
      { name: 'member', type: 'address', indexed: true },
    ],
  },
  {
    type: 'event',
    name: 'GuildMemberRemoved',
    inputs: [
      { name: 'guild', type: 'address', indexed: true },
      { name: 'member', type: 'address', indexed: true },
    ],
  },
  {
    type: 'event',
    name: 'GuildBoardEntryAdded',
    inputs: [
      { name: 'guild', type: 'address', indexed: true },
      { name: 'missionId', type: 'uint256', indexed: true },
      { name: 'curator', type: 'address', indexed: true },
    ],
  },
] as const;

/**
 * PaymentRouter ABI
 * Routes mission payments to various treasuries with fixed + variable fees
 */
export const PaymentRouterABI = [
  {
    type: 'function',
    name: 'settlePayment',
    inputs: [
      { name: 'missionId', type: 'uint256' },
      { name: 'performer', type: 'address' },
      { name: 'rewardAmount', type: 'uint256' },
      { name: 'guild', type: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getFeeSplit',
    inputs: [
      { name: 'rewardAmount', type: 'uint256' },
      { name: 'guild', type: 'address' },
      { name: 'guildFeeBps', type: 'uint16' },
    ],
    outputs: [
      {
        name: 'split',
        type: 'tuple',
        components: [
          { name: 'performerAmount', type: 'uint256' },
          { name: 'protocolAmount', type: 'uint256' },
          { name: 'guildAmount', type: 'uint256' },
          { name: 'resolverAmount', type: 'uint256' },
          { name: 'labsAmount', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'getFixedFees',
    inputs: [],
    outputs: [
      { name: 'protocolFeeBps', type: 'uint16' },
      { name: 'labsFeeBps', type: 'uint16' },
      { name: 'resolverFeeBps', type: 'uint16' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'event',
    name: 'PaymentSettled',
    inputs: [
      { name: 'missionId', type: 'uint256', indexed: true },
      { name: 'performer', type: 'address', indexed: true },
      { name: 'performerAmount', type: 'uint256', indexed: false },
      { name: 'protocolAmount', type: 'uint256', indexed: false },
      { name: 'guildAmount', type: 'uint256', indexed: false },
      { name: 'resolverAmount', type: 'uint256', indexed: false },
      { name: 'labsAmount', type: 'uint256', indexed: false },
    ],
  },
] as const;

/**
 * ReputationAttestations ABI
 * On-chain reputation and rating storage
 */
export const ReputationAttestationsABI = [
  {
    type: 'function',
    name: 'submitRating',
    inputs: [
      { name: 'missionId', type: 'uint256' },
      { name: 'ratee', type: 'address' },
      { name: 'score', type: 'uint8' },
      { name: 'commentHash', type: 'bytes32' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getRating',
    inputs: [
      { name: 'missionId', type: 'uint256' },
      { name: 'rater', type: 'address' },
      { name: 'ratee', type: 'address' },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'score', type: 'uint8' },
          { name: 'commentHash', type: 'bytes32' },
          { name: 'timestamp', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getAverageRating',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      { name: 'average', type: 'uint256' },
      { name: 'count', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'RatingSubmitted',
    inputs: [
      { name: 'missionId', type: 'uint256', indexed: true },
      { name: 'rater', type: 'address', indexed: true },
      { name: 'ratee', type: 'address', indexed: true },
      { name: 'score', type: 'uint8', indexed: false },
      { name: 'commentHash', type: 'bytes32', indexed: false },
    ],
  },
] as const;

/**
 * HorizonAchievements ABI
 * ERC-721 achievements with soulbound support
 */
export const HorizonAchievementsABI = [
  {
    type: 'function',
    name: 'mintAchievement',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'typeId', type: 'uint256' },
      { name: 'proofHash', type: 'bytes32' },
    ],
    outputs: [{ name: 'tokenId', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'createAchievementType',
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'category', type: 'uint8' },
      { name: 'isSoulbound', type: 'bool' },
      { name: 'maxSupply', type: 'uint256' },
      { name: 'tokenURI', type: 'string' },
      { name: 'xpReward', type: 'uint256' },
    ],
    outputs: [{ name: 'typeId', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getAchievementType',
    inputs: [{ name: 'typeId', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'typeId', type: 'uint256' },
          { name: 'name', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'category', type: 'uint8' },
          { name: 'isSoulbound', type: 'bool' },
          { name: 'isActive', type: 'bool' },
          { name: 'maxSupply', type: 'uint256' },
          { name: 'currentSupply', type: 'uint256' },
          { name: 'baseTokenURI', type: 'string' },
          { name: 'xpReward', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'hasAchievement',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'typeId', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isSoulbound',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'tokenOfOwnerByIndex',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'index', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'AchievementMinted',
    inputs: [
      { name: 'tokenId', type: 'uint256', indexed: true },
      { name: 'typeId', type: 'uint256', indexed: true },
      { name: 'recipient', type: 'address', indexed: true },
      { name: 'proofHash', type: 'bytes32', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'AchievementTypeCreated',
    inputs: [
      { name: 'typeId', type: 'uint256', indexed: true },
      { name: 'name', type: 'string', indexed: false },
      { name: 'category', type: 'uint8', indexed: false },
    ],
  },
] as const;

/**
 * Standard ERC20 ABI (for USDC interactions)
 */
export const ERC20ABI = [
  {
    type: 'function',
    name: 'approve',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'decimals',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'transfer',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const;


