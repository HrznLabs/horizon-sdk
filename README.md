# Horizon Protocol SDK

**What's new in v0.3.0** (2026-10-13) — breaking vs 0.2.x types:
- **ABI sync with deployed contracts** (regenerated from the monorepo's compiled artifacts): `PaymentRouter.settlePayment` now takes the `address token` param (5 args, selector `0xd764208a`); `MissionParams` gains `minReputation` (`MissionFactory.getMissionParams` / `MissionEscrow.getParams`); `GuildConfig` gains the MetaDAO hierarchy fields `isMetaDAO`, `parentMetaDAO`, `metaDAOFeeBps` (`GuildDAO.getConfig`). `HorizonAchievements` events also fixed.
- **New delivery / iTake ABIs**: `DeliveryMissionFactoryABI`, `DeliveryEscrowABI`, `ReputationOracleABI`, `DeliveriesDAOABI`, plus `DeliveryParams` / `DeliverySettlement` types.
- **Base Sepolia redeploy (2026-10-13)** of the iTake guild factory and delivery contracts: iTakeGuildFactory `0xB3720D5f3Ff1A6385aC0C1f54f88536F68a967F3`, DeliveryMissionFactory `0xf02Cdc9eD74E2fd63Cc98ED10e78A53512e25d53`, DeliveryEscrow impl `0x0A2F4Eeed28D630f0592068054e974991eBFe08B`.
- A drift test now fails CI if any shipped ABI diverges from the compiled contracts (`yarn sync-abis <horizon>/packages/contracts/out` regenerates).

Previously, **v0.2.0** (2026-05-10): Base Sepolia addresses synced to Phase 13 redeployment; `MissionFactory.createMission` gained `paymentToken` and `minReputation`; `ContractAddresses` expanded with iTake, treasury, and M5 token fields.

**TypeScript SDK** for developers integrating Horizon Protocol into applications on Base L2.

## When to Use This SDK

Use this SDK if you're building:
- **Custom frontends** that interact with Horizon smart contracts
- **Verticals or dApps** leveraging Horizon for mission/task management
- **Wallets, dashboards, or tools** that need to parse Horizon data or calculate fees
- **Backend services** that need to interact with Horizon contracts

The SDK provides contract ABIs, type definitions, network helpers, and utility functions to simplify protocol integration.

## Features

- **20 Contract ABIs**: core, token/governance (M5), iTake delivery vertical, and ERC20
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

20 contract ABIs are exported (from the root and from the `horizon-protocol-sdk/abis` subpath):

```ts
import {
  // Core
  MissionFactoryABI,    // Mission creation and management
  MissionEscrowABI,     // Individual mission escrow
  GuildFactoryABI,      // Guild deployment
  GuildDAOABI,          // Guild governance, roles, MetaDAO hierarchy
  PaymentRouterABI,     // Fee distribution and settlement
  DisputeResolverABI,   // Disputes and appeals
  ReputationAttestationsABI,  // On-chain ratings
  HorizonAchievementsABI,     // NFT achievements
  ERC20ABI,             // USDC / EURC token interactions
  // Token economics (M5)
  HorizonTokenABI, SHRZNVaultABI, FeeDistributorABI, HorizonVestingABI,
  HorizonGovernorABI, HorizonTimelockABI, BuybackExecutorABI,
  // iTake delivery vertical
  DeliveryMissionFactoryABI,  // Delivery mission creation
  DeliveryEscrowABI,          // Per-delivery escrow, tracking, settlement
  ReputationOracleABI,        // Reputation gating
  DeliveriesDAOABI,           // Courier insurance DAO — NOT a GuildDAO, don't use GuildDAOABI on it
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
// 0x8D780F03206E6433c2e5F7E0aB40244Ee051a271
```

## Contract Addresses (Base Sepolia)

Core contracts redeployed 2026-10-14 (PaymentRouter, MissionFactory, MissionEscrowImpl, DisputeResolver, PauseRegistry), plus the 2026-10-13 iTake/delivery redeploy. **`src/constants.ts` is canonical** — it also holds the remaining iTake, treasury, and vesting addresses (`BASE_SEPOLIA.contracts.*`).

| Contract | Address |
|----------|---------|
| MissionFactory (2026-10-14) | `0x8D780F03206E6433c2e5F7E0aB40244Ee051a271` |
| MissionEscrowImpl (2026-10-14) | `0x9aBe058635D961191571140948774cD829847406` |
| GuildFactory | `0x7349Cd1A4f7C1a74Db730743d873de98A2f3a32F` |
| PaymentRouter (2026-10-14) | `0x3a84718A90E03621526748A1721f10D32BEaf903` |
| DisputeResolver (2026-10-14) | `0x073A3674FB09177fcD6615bD920Ca1Fc52Fbd156` |
| PauseRegistry (2026-10-14) | `0x05Ec569d16Ac6b7B5dEB8B815976512CED645A87` |
| HorizonAchievements | `0xfCC5971C3704C7a1F1c9E4acFdC7eEd60D4e4949` |
| HorizonToken (HRZN) | `0xe4f29a413c24B6020FE344C412D9f82Df15809aF` |
| sHRZNVault | `0xf3D693616d6b185b36D4a2e36663E5932d351758` |
| FeeDistributor | `0x75F875D3c1d01F9A31C7Bd85A5098bD9448b6440` |
| HorizonGovernor | `0xE52CCaa9980f0aD00F48BebCbB7294c3c5F644A7` |
| GovernorTimelock | `0xD0112d484B3261b26D8721e074dC82866A85977C` |
| BuybackExecutor | `0x57Bad3A5871BAEAB2e8aee1D5017Aa272f6564FA` |
| USDC (Base Sepolia) | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` |
| EURC (Base Sepolia) | `0x808456652fdb597867f38412077A9182bf77359F` |
| iTakeGuildFactory (2026-10-13) | `0xB3720D5f3Ff1A6385aC0C1f54f88536F68a967F3` |
| DeliveryMissionFactory (2026-10-13) | `0xf02Cdc9eD74E2fd63Cc98ED10e78A53512e25d53` |
| DeliveryEscrow impl (2026-10-13) | `0x0A2F4Eeed28D630f0592068054e974991eBFe08B` |
| DeliveriesDAO (insurance, not a GuildDAO) | `0xaB2F7787b72FcFfEA8E543375FE2db44D9C6ae53` |

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
import {
  MissionState,
  type Mission,
  type MissionParams,     // includes minReputation
  type GuildConfig,       // includes isMetaDAO / parentMetaDAO / metaDAOFeeBps
  type DeliveryParams,
  type DeliverySettlement,
  type Rating,
  type FeeSplit,
  type NetworkConfig,
} from 'horizon-protocol-sdk';
```

## Related Packages

- [`horizon-contracts`](https://github.com/HrznLabs/horizon-contracts) - Smart contract source code
- [`horizon`](https://github.com/HrznLabs/horizon) - Full protocol monorepo

## License

MIT
