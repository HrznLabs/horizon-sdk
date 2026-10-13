#!/usr/bin/env node
// =============================================================================
// Sync SDK ABIs from the monorepo's Foundry build output.
//
// Usage:
//   node scripts/sync-abis.mjs <path-to>/horizon/packages/contracts/out
//
// 1. Regenerates every ABI listed in GENERATED from `out/<C>.sol/<C>.json`
//    (`.abi` field, minus `internalType`) inside src/abis/index.ts — existing export blocks
//    are replaced in place, missing ones are appended.
// 2. Writes test/fixtures/contract-abis.json: the artifact ABIs (functions,
//    events, errors) for every SDK ABI that maps to a monorepo contract, so the
//    drift test (test/abi-drift.test.ts) can run in CI without the monorepo.
// =============================================================================
import fs from 'node:fs';
import path from 'node:path';

const outDir = process.argv[2];
if (!outDir || !fs.existsSync(outDir)) {
  console.error('usage: node scripts/sync-abis.mjs <contracts/out dir>');
  process.exit(1);
}

/** SDK export name -> contract name. Regenerated verbatim from artifacts. */
const GENERATED = {
  MissionFactoryABI: ['MissionFactory', 'Factory deploying MissionEscrow clones (EIP-1167) — generated from artifact'],
  MissionEscrowABI: ['MissionEscrow', 'Per-mission escrow with full lifecycle management — generated from artifact'],
  GuildDAOABI: ['GuildDAO', 'Guild governance, roles, and config (incl. MetaDAO hierarchy) — generated from artifact'],
  PaymentRouterABI: ['PaymentRouter', 'Fee distribution and settlement (multi-token) — generated from artifact'],
  HorizonAchievementsABI: ['HorizonAchievements', 'Achievement NFTs (ERC-1155) — generated from artifact'],
  DeliveryMissionFactoryABI: ['DeliveryMissionFactory', 'iTake delivery vertical: factory deploying DeliveryEscrow clones — generated from artifact'],
  DeliveryEscrowABI: ['DeliveryEscrow', 'iTake delivery vertical: per-delivery escrow with tracking and settlement — generated from artifact'],
  ReputationOracleABI: ['ReputationOracle', 'Reputation oracle used for mission/delivery reputation gating — generated from artifact'],
  DeliveriesDAOABI: ['DeliveriesDAO', 'iTake delivery vertical: courier insurance DAO (NOT a GuildDAO) — generated from artifact'],
};

/** Hand-curated SDK ABIs that are subsets of a monorepo contract (drift-checked only). */
const CURATED = {
  GuildFactoryABI: 'GuildFactory',
  HorizonTokenABI: 'HorizonToken',
  SHRZNVaultABI: 'sHRZNVault',
  FeeDistributorABI: 'FeeDistributor',
  HorizonVestingABI: 'HorizonVesting',
  HorizonGovernorABI: 'HorizonGovernor',
  HorizonTimelockABI: 'HorizonTimelock',
  DisputeResolverABI: 'DisputeResolver',
  BuybackExecutorABI: 'BuybackExecutor',
};

const readAbi = (c) => JSON.parse(fs.readFileSync(path.join(outDir, `${c}.sol`, `${c}.json`), 'utf8')).abi;

// `internalType` (Solidity struct/enum names) is not used by viem for encoding or
// type inference; dropping it keeps the published bundle ~40% smaller.
const stripInternal = (v) =>
  Array.isArray(v)
    ? v.map(stripInternal)
    : v && typeof v === 'object'
      ? Object.fromEntries(Object.entries(v).filter(([k]) => k !== 'internalType').map(([k, x]) => [k, stripInternal(x)]))
      : v;

// Serialize as a TS literal: unquoted identifier keys, single-quoted strings.
function ser(v, ind = '') {
  const n = ind + '  ';
  if (Array.isArray(v)) {
    if (v.length === 0) return '[]';
    return '[\n' + v.map((x) => n + ser(x, n)).join(',\n') + ',\n' + ind + ']';
  }
  if (v && typeof v === 'object') {
    const ks = Object.keys(v);
    if (ks.length === 0) return '{}';
    return '{\n' + ks.map((k) => `${n}${/^[A-Za-z_$][\w$]*$/.test(k) ? k : `'${k}'`}: ${ser(v[k], n)}`).join(',\n') + ',\n' + ind + '}';
  }
  if (typeof v === 'string') return `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  return JSON.stringify(v);
}

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const abisFile = path.join(root, 'src/abis/index.ts');
let src = fs.readFileSync(abisFile, 'utf8');

for (const [name, [contract, doc]] of Object.entries(GENERATED)) {
  const body = `export const ${name} = ${ser(stripInternal(readAbi(contract)))} as const;`;
  const re = new RegExp(`export const ${name} = \\[[\\s\\S]*?\\n\\] as const;`);
  if (re.test(src)) {
    src = src.replace(re, () => body);
  } else {
    src = src.trimEnd() + `\n\n/**\n * ${contract} ABI\n * ${doc}\n */\n${body}\n`;
  }
}
fs.writeFileSync(abisFile, src);

const fixture = {};
for (const [name, contract] of [
  ...Object.entries(GENERATED).map(([k, [c]]) => [k, c]),
  ...Object.entries(CURATED),
]) {
  fixture[name] = {
    contract,
    generated: name in GENERATED,
    abi: stripInternal(readAbi(contract)).filter((i) => ['function', 'event', 'error'].includes(i.type)),
  };
}
fs.mkdirSync(path.join(root, 'test/fixtures'), { recursive: true });
fs.writeFileSync(path.join(root, 'test/fixtures/contract-abis.json'), JSON.stringify(fixture) + '\n');
console.log(`synced ${Object.keys(GENERATED).length} ABIs, fixture covers ${Object.keys(fixture).length} contracts`);
