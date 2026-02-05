# Horizon Protocol SDK

**TypeScript SDK** for developers integrating Horizon Protocol into applications on Base L2.

## When to Use This SDK

Use this SDK if you're building:
- **Custom frontends** that interact with Horizon smart contracts
- **Verticals or dApps** leveraging Horizon for mission/task management
- **Wallets, dashboards, or tools** that need to parse Horizon data or calculate fees

The SDK provides contract ABIs, type definitions, network helpers, and utility functions to simplify protocol integration.

## Features

- Contract ABIs for all core contracts
- Typed constants (addresses, fee config, chain IDs)
- Utility helpers (USDC parsing, fee splits, time helpers)
- Type definitions for protocol entities

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

```ts
import {
  MissionFactoryABI,
  MissionEscrowABI,
  GuildFactoryABI,
  GuildDAOABI,
  PaymentRouterABI,
  ReputationAttestationsABI,
  HorizonAchievementsABI,
  ERC20ABI,
} from 'horizon-protocol-sdk';
```

## Network Helpers

```ts
import { getNetwork, getContracts, BASE_SEPOLIA, BASE_MAINNET } from 'horizon-protocol-sdk';

const network = getNetwork(84532);
const contracts = getContracts(84532);
```

## Utilities

```ts
import {
  parseUSDC,
  formatUSDC,
  calculateFeeSplit,
  calculateDDR,
  calculateLPP,
  calculateExpiresAt,
  isMissionExpired,
  toBytes32,
  randomBytes32,
  formatAddress,
} from 'horizon-protocol-sdk';
```

## License

MIT
