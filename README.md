# Horizon Protocol SDK

TypeScript SDK for integrating with Horizon Protocol on Base.

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
