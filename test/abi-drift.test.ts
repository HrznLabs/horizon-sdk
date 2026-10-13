import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { toEventSelector, toFunctionSelector, type AbiParameter } from 'viem';
import { formatAbiItem } from 'viem/utils';
import * as abis from '../src/abis';
import * as sdk from '../src';
import fixture from './fixtures/contract-abis.json';

// Drift guard: every function/event/error the SDK ships must exist — with the
// same inputs AND outputs — in the compiled monorepo contract. The fixture is
// produced by `node scripts/sync-abis.mjs <horizon>/packages/contracts/out`.
// Set HORIZON_CONTRACTS_OUT to check against a live forge build instead.

type Item = {
  type: string;
  name?: string;
  inputs?: readonly AbiParameter[];
  outputs?: readonly AbiParameter[];
};
type Entry = { contract: string; generated: boolean; abi: Item[] };

const live = process.env.HORIZON_CONTRACTS_OUT;
const contracts = fixture as unknown as Record<string, Entry>;

function artifactAbi(name: string): Item[] {
  const entry = contracts[name];
  if (!live) return entry.abi;
  const file = path.join(live, `${entry.contract}.sol`, `${entry.contract}.json`);
  return JSON.parse(fs.readFileSync(file, 'utf8')).abi;
}

const tuple = (ps: readonly AbiParameter[] = []) =>
  formatAbiItem({ type: 'function', name: 'x', inputs: ps, outputs: [], stateMutability: 'view' } as never);

const signature = (i: Item) =>
  `${i.type} ${formatAbiItem(i as never)}${i.type === 'function' ? ` returns ${tuple(i.outputs)}` : ''}`;

const members = (abi: readonly Item[]) =>
  abi.filter((i) => i.type === 'function' || i.type === 'event' || i.type === 'error');

describe('ABI drift vs compiled contracts', () => {
  it('PaymentRouter.settlePayment is the deployed 5-arg (token) variant', () => {
    const fn = abis.PaymentRouterABI.find(
      (i) => i.type === 'function' && i.name === 'settlePayment'
    );
    expect(fn).toBeDefined();
    expect(toFunctionSelector(fn as never)).toBe('0xd764208a');
  });

  it('MissionParams tuple includes minReputation (8 fields)', () => {
    for (const [abi, fnName] of [
      [abis.MissionFactoryABI, 'getMissionParams'],
      [abis.MissionEscrowABI, 'getParams'],
    ] as const) {
      const fn = (abi as readonly Item[]).find((i) => i.type === 'function' && i.name === fnName);
      const comps = (fn?.outputs?.[0] as { components?: AbiParameter[] }).components ?? [];
      expect(comps.map((c) => c.name)).toContain('minReputation');
      expect(comps).toHaveLength(8);
    }
  });

  it('GuildDAO.getConfig returns the 7-field config with MetaDAO hierarchy', () => {
    const fn = (abis.GuildDAOABI as readonly Item[]).find(
      (i) => i.type === 'function' && i.name === 'getConfig'
    );
    const comps = (fn?.outputs?.[0] as { components?: AbiParameter[] }).components ?? [];
    expect(comps.map((c) => c.name)).toEqual(
      expect.arrayContaining(['isMetaDAO', 'parentMetaDAO', 'metaDAOFeeBps'])
    );
    expect(comps).toHaveLength(7);
  });

  it('delivery ABIs are exported from the root and ./abis entry points', () => {
    for (const name of [
      'DeliveryMissionFactoryABI',
      'DeliveryEscrowABI',
      'ReputationOracleABI',
      'DeliveriesDAOABI',
    ] as const) {
      expect(Array.isArray(abis[name])).toBe(true);
      expect(abis[name].length).toBeGreaterThan(0);
      expect(sdk[name]).toBe(abis[name]);
    }
  });

  describe.each(Object.keys(contracts))('%s', (name) => {
    const sdkAbi = (abis as unknown as Record<string, readonly Item[]>)[name];
    const art = members(artifactAbi(name));
    const artSigs = new Set(art.map(signature));

    it('is exported by the SDK', () => {
      expect(sdkAbi).toBeDefined();
    });

    it('every SDK function selector exists in the artifact', () => {
      const artSelectors = new Set(
        art.filter((i) => i.type === 'function').map((i) => toFunctionSelector(i as never))
      );
      const missing = members(sdkAbi)
        .filter((i) => i.type === 'function')
        .filter((i) => !artSelectors.has(toFunctionSelector(i as never)))
        .map((i) => formatAbiItem(i as never));
      expect(missing).toEqual([]);
    });

    it('every SDK event topic exists in the artifact', () => {
      const artTopics = new Set(
        art.filter((i) => i.type === 'event').map((i) => toEventSelector(i as never))
      );
      const missing = members(sdkAbi)
        .filter((i) => i.type === 'event')
        .filter((i) => !artTopics.has(toEventSelector(i as never)))
        .map((i) => formatAbiItem(i as never));
      expect(missing).toEqual([]);
    });

    it('every SDK function/event/error matches the artifact incl. return types', () => {
      const drift = members(sdkAbi)
        .map(signature)
        .filter((s) => !artSigs.has(s));
      expect(drift).toEqual([]);
    });

    if (contracts[name].generated) {
      it('generated ABI is complete (no artifact member missing)', () => {
        const sdkSigs = new Set(members(sdkAbi).map(signature));
        expect([...artSigs].filter((s) => !sdkSigs.has(s))).toEqual([]);
      });
    }
  });
});
