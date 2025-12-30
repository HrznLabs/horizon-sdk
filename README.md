# Horizon Protocol SDK

[![npm version](https://img.shields.io/npm/v/@horizon-protocol/sdk.svg)](https://www.npmjs.com/package/@horizon-protocol/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Base](https://img.shields.io/badge/Built%20for-Base-0052FF)](https://base.org)

TypeScript SDK for integrating with **Horizon Protocol** - decentralized mission coordination on Base (Optimism L2).

## ✨ Features

- 📦 **Contract ABIs** - Type-safe ABIs for all 8 Horizon Protocol contracts
- 🔧 **Utility Functions** - USDC parsing, fee calculations, address formatting
- 🌐 **Network Configs** - Pre-configured for Base Sepolia and Base Mainnet
- 📝 **TypeScript Types** - Full type definitions for all protocol entities
- 🪶 **Lightweight** - Zero dependencies except peer dependency on `viem`

## Installation

```bash
# Using yarn
yarn add @horizon-protocol/sdk viem

# Using npm
npm install @horizon-protocol/sdk viem

# Using pnpm
pnpm add @horizon-protocol/sdk viem
```

## Quick Start

```typescript
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import {
  BASE_SEPOLIA,
  MissionFactoryABI,
  parseUSDC,
  formatUSDC,
  calculateFeeSplit,
} from '@horizon-protocol/sdk';

// Create viem client
const client = createPublicClient({
  chain: baseSepolia,
  transport: http(BASE_SEPOLIA.rpcUrl),
});

// Read mission count
const missionCount = await client.readContract({
  address: BASE_SEPOLIA.contracts.missionFactory,
  abi: MissionFactoryABI,
  functionName: 'missionCount',
});

console.log(`Total missions: ${missionCount}`);

// Calculate fee split for a 100 USDC reward
const reward = parseUSDC(100);
const fees = calculateFeeSplit(reward, 300); // 3% guild fee

console.log('Fee breakdown:');
console.log(`  Performer: ${formatUSDC(fees.performerAmount)} USDC`);
console.log(`  Protocol: ${formatUSDC(fees.protocolAmount)} USDC`);
console.log(`  Guild: ${formatUSDC(fees.guildAmount)} USDC`);
```

## Contract ABIs

All 8 Horizon Protocol contract ABIs are included:

```typescript
import {
  MissionFactoryABI,         // Mission creation and lookup
  MissionEscrowABI,          // Individual mission escrow lifecycle
  GuildFactoryABI,           // Guild creation
  GuildDAOABI,               // Guild governance and membership
  PaymentRouterABI,          // Fee distribution
  ReputationAttestationsABI, // On-chain ratings
  HorizonAchievementsABI,    // Achievement NFTs (soulbound + tradable)
  ERC20ABI,                  // USDC interactions
} from '@horizon-protocol/sdk';
```

## Network Configuration

```typescript
import { BASE_SEPOLIA, BASE_MAINNET, getContracts, getNetwork } from '@horizon-protocol/sdk';

// Pre-configured networks with all contract addresses
console.log(BASE_SEPOLIA.contracts.missionFactory);
// => '0xee9234954b134c39c17a75482da78e46b16f466c'

// Get contracts by chain ID
const contracts = getContracts(84532); // Base Sepolia chain ID

// Get full network config
const network = getNetwork(84532);
console.log(network.name); // => 'Base Sepolia'
```

## Utility Functions

### USDC Parsing

```typescript
import { parseUSDC, formatUSDC, USDC_DECIMALS } from '@horizon-protocol/sdk';

// Parse human-readable to on-chain format
const amount = parseUSDC('10.50'); // => 10500000n (BigInt)
const amount2 = parseUSDC(10.5);   // => 10500000n

// Format on-chain to human-readable
const display = formatUSDC(10500000n); // => '10.500000'
```

### Fee Calculations

```typescript
import { calculateFeeSplit, calculateDDR, calculateLPP, FEES } from '@horizon-protocol/sdk';

// Calculate fee split for 100 USDC with 3% guild fee
const fees = calculateFeeSplit(parseUSDC(100), 300);
console.log(fees);
// => {
//   performerAmount: 87000000n,  // 87 USDC
//   protocolAmount: 4000000n,    // 4 USDC
//   labsAmount: 4000000n,        // 4 USDC
//   resolverAmount: 2000000n,    // 2 USDC
//   guildAmount: 3000000n,       // 3 USDC
// }

// Calculate DDR deposit (5% of reward)
const ddr = calculateDDR(parseUSDC(100)); // => 5000000n (5 USDC)

// Calculate LPP penalty (2% of reward)
const lpp = calculateLPP(parseUSDC(100)); // => 2000000n (2 USDC)
```

### Mission Utilities

```typescript
import { 
  calculateExpiresAt, 
  isMissionExpired, 
  toBytes32, 
  randomBytes32,
  formatAddress 
} from '@horizon-protocol/sdk';

// Create expiration timestamp (24 hours from now)
const expiresAt = calculateExpiresAt(24 * 3600);

// Check if mission expired
const expired = isMissionExpired(expiresAt);

// Convert string to bytes32 (for IPFS hashes, etc.)
const metadataHash = toBytes32('QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco');

// Generate random bytes32 (for proofs, etc.)
const proofHash = randomBytes32();

// Format address for display
const short = formatAddress('0x1234...5678'); // => '0x1234...5678'
```

## Types

```typescript
import {
  // Enums
  MissionState,
  DisputeState,
  DisputeOutcome,
  AchievementCategory,
  
  // Types
  type Mission,
  type MissionParams,
  type MissionRuntime,
  type GuildConfig,
  type FeeSplit,
  type Rating,
  type AchievementType,
  type NetworkConfig,
  type ContractAddresses,
  type CreateMissionParams,
  type CreateGuildParams,
} from '@horizon-protocol/sdk';

// Mission states
if (mission.runtime.state === MissionState.Submitted) {
  console.log('Ready for approval');
}

// Dispute outcomes
if (dispute.outcome === DisputeOutcome.PerformerWins) {
  console.log('Performer won the dispute');
}
```

## Constants

```typescript
import {
  USDC_DECIMALS,      // 6
  MIN_REWARD,         // 1 USDC (1000000n)
  MAX_REWARD,         // 100,000 USDC
  MIN_DURATION,       // 1 hour (3600)
  MAX_DURATION,       // 30 days
  FEES,               // { PROTOCOL_BPS: 400, LABS_BPS: 400, RESOLVER_BPS: 200 }
  APPEAL_PERIOD,      // 48 hours (172800)
  ZERO_ADDRESS,       // 0x0000...0000
} from '@horizon-protocol/sdk';
```

## Example: Create Mission

```typescript
import { createWalletClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import {
  BASE_SEPOLIA,
  MissionFactoryABI,
  ERC20ABI,
  parseUSDC,
  calculateExpiresAt,
  toBytes32,
  ZERO_ADDRESS,
} from '@horizon-protocol/sdk';

const account = privateKeyToAccount('0x...');

const walletClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(),
});

// 1. Approve USDC spending
const rewardAmount = parseUSDC(50); // 50 USDC

await walletClient.writeContract({
  address: BASE_SEPOLIA.contracts.usdc,
  abi: ERC20ABI,
  functionName: 'approve',
  args: [BASE_SEPOLIA.contracts.missionFactory, rewardAmount],
});

// 2. Create mission
const hash = await walletClient.writeContract({
  address: BASE_SEPOLIA.contracts.missionFactory,
  abi: MissionFactoryABI,
  functionName: 'createMission',
  args: [
    rewardAmount,
    calculateExpiresAt(24 * 3600), // 24 hours
    ZERO_ADDRESS, // No guild
    toBytes32('QmMetadataHash...'),
    toBytes32('QmLocationHash...'),
  ],
});

console.log('Mission created:', hash);
```

## Example: Accept and Complete Mission

```typescript
import { 
  MissionEscrowABI, 
  MissionState,
  toBytes32,
} from '@horizon-protocol/sdk';

// Accept mission (as performer)
await walletClient.writeContract({
  address: escrowAddress,
  abi: MissionEscrowABI,
  functionName: 'acceptMission',
});

// Submit proof of completion
await walletClient.writeContract({
  address: escrowAddress,
  abi: MissionEscrowABI,
  functionName: 'submitProof',
  args: [toBytes32('QmProofHash...')],
});

// Approve completion (as poster) - triggers payment
await walletClient.writeContract({
  address: escrowAddress,
  abi: MissionEscrowABI,
  functionName: 'approveCompletion',
});
```

## Contract Addresses

### Base Sepolia (Testnet)

| Contract | Address |
|----------|---------|
| PaymentRouter | `0x94fb7908257ec36f701d2605b51eefed4326ddf5` |
| MissionFactory | `0xee9234954b134c39c17a75482da78e46b16f466c` |
| GuildFactory | `0xfeae3538a4a1801e47b6d16104aa8586edb55f00` |
| ReputationAttestations | `0xedae9682a0fb6fb3c18d6865461f67db7d748002` |
| DisputeResolver | `0xb00ac4278129928aecc72541b0bcd69d94c1691e` |
| HorizonAchievements | `0x568e0e3102bfa1f4045d3f62559c0f9823b469bc` |
| USDC | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` |

## Related Packages

- [horizon-contracts](https://github.com/HrznLabs/horizon-contracts) - Solidity smart contracts

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](./LICENSE)

---

Built with ❤️ by Horizon Labs | Powered by Base (Optimism L2)
