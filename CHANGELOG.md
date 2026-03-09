# Changelog

All notable changes to `horizon-protocol-sdk` will be documented in this file.

## [0.2.0] - 2026-03-09

### Added
- `BuybackExecutorABI` export — ABI for the buyback-and-burn contract (Aerodrome USDC-to-HRZN swap + burn)
- `buybackExecutor` address in `BASE_SEPOLIA_CONTRACTS` (`0x42cf55353e150C91b522497e220E736ceF0f8890`)
- `buybackExecutor` field in `ContractAddresses` type
- This CHANGELOG

## [0.1.0] - 2026-02-21

### Added
- Initial SDK release with v2.2 core contract ABIs
- M5 token economics ABIs: `HorizonTokenABI`, `SHRZNVaultABI`, `FeeDistributorABI`, `HorizonVestingABI`, `HorizonGovernorABI`, `HorizonTimelockABI`
- Core ABIs: `MissionFactoryABI`, `MissionEscrowABI`, `GuildFactoryABI`, `GuildDAOABI`, `PaymentRouterABI`, `ReputationAttestationsABI`, `HorizonAchievementsABI`, `ERC20ABI`
- Type definitions for missions, guilds, ratings, achievements, governance
- Constants: fee structure, network configs, contract addresses (Base Sepolia + Base Mainnet placeholders)
- Utility functions: `parseUSDC`, `formatUSDC`, `calculateFeeSplit`, `toBytes32`, `getBaseScanUrl`, etc.
