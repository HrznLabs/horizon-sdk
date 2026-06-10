# Horizon Protocol SDK

**What's new in v0.2.0** (2026-05-10): Base Sepolia addresses synced to Phase 13 redeployment (2026-03-10); `MissionFactory.createMission` ABI now includes `paymentToken` (first arg) and `minReputation` (last arg); `ContractAddresses` expanded with iTake vertical, treasury, and full M5 token fields.

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
// 0x6d97964E9BE016A8AABA2f99F0bA419464Fb88D9
```

## Contract Addresses (Base Sepolia)

Phase 13 redeployment (2026-03-10). Source of truth: `src/constants.ts`.

| Contract | Address |
|----------|---------|
| MissionFactory | `0x6d97964E9BE016A8AABA2f99F0bA419464Fb88D9` |
| MissionEscrowImpl | `0x3b02a7eac30Bc4a800Eebd69Fed75c818dB92099` |
| GuildFactory | `0x7349Cd1A4f7C1a74Db730743d873de98A2f3a32F` |
| PaymentRouter | `0x3013db6C92EF956f86EBC0aDFECe70b80FA73600` |
| DisputeResolver | `0xdE37Ff10A487c852941DC842987dd8d5d8b9E855` |
| HorizonAchievements | `0xfCC5971C3704C7a1F1c9E4acFdC7eEd60D4e4949` |
| HorizonToken (HRZN) | `0xe4f29a413c24B6020FE344C412D9f82Df15809aF` |
| sHRZNVault | `0xf3D693616d6b185b36D4a2e36663E5932d351758` |
| FeeDistributor | `0x75F875D3c1d01F9A31C7Bd85A5098bD9448b6440` |
| HorizonGovernor | `0xE52CCaa9980f0aD00F48BebCbB7294c3c5F644A7` |
| GovernorTimelock | `0xD0112d484B3261b26D8721e074dC82866A85977C` |
| BuybackExecutor | `0x57Bad3A5871BAEAB2e8aee1D5017Aa272f6564FA` |
| USDC (Base Sepolia) | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` |
| EURC (Base Sepolia) | `0x808456652fdb597867f38412077A9182bf77359F` |

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

const expiresAt = calculateExpiresAt(7 * 24 * 60 * 60);  // 7 days from now (in seconds)
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
