# Horizon Protocol SDK

[![npm version](https://img.shields.io/npm/v/horizon-protocol-sdk.svg)](https://www.npmjs.com/package/horizon-protocol-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

TypeScript SDK for integrating with **Horizon Protocol** - decentralized mission coordination on Base.

## Installation

```bash
# Using yarn
yarn add horizon-protocol-sdk viem

# Using npm
npm install horizon-protocol-sdk viem
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
} from 'horizon-protocol-sdk';

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

## Features

- 📦 **Contract ABIs** - Type-safe ABIs for all Horizon Protocol contracts
- 🔧 **Utility Functions** - USDC parsing, fee calculations, address formatting
- 🌐 **Network Configs** - Pre-configured for Base Sepolia and Base Mainnet
- 📝 **TypeScript Types** - Full type definitions for all protocol entities

## Contract ABIs

```typescript
import {
  MissionFactoryABI,    // Mission creation and lookup
  MissionEscrowABI,     // Individual mission escrow
  GuildFactoryABI,      // Guild creation
  GuildDAOABI,          // Guild governance
  PaymentRouterABI,     // Fee distribution
  ReputationAttestationsABI,  // Ratings
  HorizonAchievementsABI,     // Achievement NFTs
  ERC20ABI,             // USDC interactions
} from 'horizon-protocol-sdk';
```

## Network Configuration

```typescript
import { BASE_SEPOLIA, BASE_MAINNET, getContracts } from 'horizon-protocol-sdk';

// Pre-configured networks
console.log(BASE_SEPOLIA.contracts.missionFactory);
// => '0xee9234954b134c39c17a75482da78e46b16f466c'

// Get contracts by chain ID
const contracts = getContracts(84532); // Base Sepolia
```

## Utility Functions

### USDC Parsing

```typescript
import { parseUSDC, formatUSDC } from 'horizon-protocol-sdk';

const amount = parseUSDC('10.50'); // => 10500000n
const display = formatUSDC(10500000n); // => '10.500000'
```

### Fee Calculations

```typescript
import { calculateFeeSplit, calculateDDR, FEES } from 'horizon-protocol-sdk';

// Calculate fee split for 100 USDC with 3% guild fee
const fees = calculateFeeSplit(parseUSDC(100), 300);
// => { performerAmount, protocolAmount, guildAmount, resolverAmount, labsAmount }

// Calculate DDR deposit (5% of reward)
const ddr = calculateDDR(parseUSDC(100)); // => 5000000n (5 USDC)
```

### Mission Utilities

```typescript
import { calculateExpiresAt, isMissionExpired, toBytes32 } from 'horizon-protocol-sdk';

// Create expiration timestamp (24 hours from now)
const expiresAt = calculateExpiresAt(24 * 3600);

// Check if mission expired
const expired = isMissionExpired(expiresAt);

// Convert IPFS hash to bytes32
const metadataHash = toBytes32('QmXoypizj...');
```

## Types

```typescript
import {
  MissionState,
  DisputeState,
  DisputeOutcome,
  AchievementCategory,
  type Mission,
  type MissionParams,
  type GuildConfig,
  type FeeSplit,
} from 'horizon-protocol-sdk';

// Mission states
if (mission.runtime.state === MissionState.Submitted) {
  // Ready for approval
}
```

## Constants

```typescript
import {
  USDC_DECIMALS,      // 6
  MIN_REWARD,         // 1 USDC
  MAX_REWARD,         // 100,000 USDC
  MIN_DURATION,       // 1 hour
  MAX_DURATION,       // 30 days
  FEES,               // { PROTOCOL_BPS, LABS_BPS, ... }
  APPEAL_PERIOD,      // 48 hours
  ZERO_ADDRESS,
} from 'horizon-protocol-sdk';
```

## Example: Create Mission

```typescript
import { createWalletClient, http, parseUnits } from 'viem';
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
} from 'horizon-protocol-sdk';

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

- [horizon-contracts](https://github.com/horizon-labs/horizon-contracts) - Solidity smart contracts
- [horizon-docs](https://docs.horizon.xyz) - Protocol documentation

## License

MIT


