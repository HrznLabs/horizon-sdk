# Horizon Protocol SDK

**TypeScript SDK** for developers integrating Horizon Protocol into applications on Base L2.

## When to Use This SDK

Use this SDK if you're building:
- **Custom frontends** that interact with Horizon smart contracts
- **Verticals or dApps** leveraging Horizon for mission/task management
- **Wallets, dashboards, or tools** that need to parse Horizon data or calculate fees
- **Backend services** that need to interact with Horizon contracts

The SDK provides contract ABIs, type definitions, network helpers, and utility functions to simplify protocol integration.

## Features

- **8 Contract ABIs** for all core contracts
- **Typed constants** (addresses, fee config, chain IDs)
- **Utility helpers** (USDC parsing, fee splits, time helpers)
- **Type definitions** for protocol entities
- **Network configuration** for Base Sepolia and Mainnet

## Install

```bash
yarn add horizon-protocol-sdk viem

# or
npm install horizon-protocol-sdk viem
```

`viem` is a peer dependency.

## Quick Start

```ts
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import {
  BASE_SEPOLIA,
  MissionFactoryABI,
  parseUSDC,
  calculateFeeSplit,
} from 'horizon-protocol-sdk';

const client = createPublicClient({
  chain: baseSepolia,
  transport: http(BASE_SEPOLIA.rpcUrl),
});

const missionCount = await client.readContract({
  address: BASE_SEPOLIA.contracts.missionFactory,
  abi: MissionFactoryABI,
  functionName: 'missionCount',
});

const fees = calculateFeeSplit(parseUSDC(100), 300); // 3% guild fee
```

## ABIs

All 8 core contract ABIs are exported:

```ts
import {
  MissionFactoryABI,    // Mission creation and management
  MissionEscrowABI,     // Individual mission escrow
  GuildFactoryABI,      // Guild deployment
  GuildDAOABI,          // Guild governance and roles
  PaymentRouterABI,     // Fee distribution
  ReputationAttestationsABI,  // On-chain ratings
  HorizonAchievementsABI,     // NFT achievements
  ERC20ABI,             // USDC token interactions
} from 'horizon-protocol-sdk';
```

## Network Helpers

```ts
import {
  getNetwork,
  getContracts,
  BASE_SEPOLIA,
  BASE_MAINNET
} from 'horizon-protocol-sdk';

// Get network by chain ID
const network = getNetwork(84532);  // Base Sepolia
const contracts = getContracts(84532);

// Direct access
console.log(BASE_SEPOLIA.contracts.missionFactory);
// 0xee9234954b134c39c17a75482da78e46b16f466c
```

## Contract Addresses (Base Sepolia)

| Contract | Address |
|----------|---------|
| MissionFactory | `0xee9234954b134c39c17a75482da78e46b16f466c` |
| GuildFactory | `0xfeae3538a4a1801e47b6d16104aa8586edb55f00` |
| PaymentRouter | `0x94fb7908257ec36f701d2605b51eefed4326ddf5` |
| ReputationAttestations | `0xedae9682a0fb6fb3c18d6865461f67db7d748002` |
| DisputeResolver | `0xb00ac4278129928aecc72541b0bcd69d94c1691e` |
| HorizonAchievements | `0x568e0e3102bfa1f4045d3f62559c0f9823b469bc` |

## Utilities

### USDC Helpers
```ts
import { parseUSDC, formatUSDC } from 'horizon-protocol-sdk';

const amount = parseUSDC(100);     // 100000000n (6 decimals)
const display = formatUSDC(amount); // "100.00"
```

### Fee Calculations
```ts
import { calculateFeeSplit, calculateDDR, calculateLPP } from 'horizon-protocol-sdk';

// Calculate fee distribution for a 100 USDC mission with 3% guild fee
const fees = calculateFeeSplit(parseUSDC(100), 300);
// { protocol: 2.5, labs: 2.5, resolver: 2, guild: 3, performer: 90 }

// Calculate dispute deposits
const ddr = calculateDDR(parseUSDC(100));  // 5% = 5 USDC
const lpp = calculateLPP(parseUSDC(100));  // 2% = 2 USDC
```

### Time Helpers
```ts
import { calculateExpiresAt, isMissionExpired } from 'horizon-protocol-sdk';

const expiresAt = calculateExpiresAt(7);  // 7 days from now
const expired = isMissionExpired(expiresAt);
```

### Hash Helpers
```ts
import { toBytes32, randomBytes32, formatAddress } from 'horizon-protocol-sdk';

const hash = toBytes32('ipfs://Qm...');
const random = randomBytes32();
const short = formatAddress('0x1234...5678');  // "0x1234...5678"
```

## Types

```ts
import type {
  Mission,
  MissionState,
  Guild,
  GuildRole,
  Rating,
  Achievement,
  FeeSplit,
  NetworkConfig,
} from 'horizon-protocol-sdk';
```

## Related Packages

- [`horizon-contracts`](https://github.com/HrznLabs/horizon-contracts) - Smart contract source code
- [`horizon`](https://github.com/HrznLabs/horizon) - Full protocol monorepo

## License

MIT
