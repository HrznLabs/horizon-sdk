const FEES = {
  PROTOCOL_BPS: 250,
  LABS_BPS: 250,
  RESOLVER_BPS: 200,
  DDR_BPS: 500,
  LPP_BPS: 200,
  MAX_GUILD_BPS: 1500,
};

const PROTOCOL_BPS_BIGINT = BigInt(FEES.PROTOCOL_BPS);
const LABS_BPS_BIGINT = BigInt(FEES.LABS_BPS);
const RESOLVER_BPS_BIGINT = BigInt(FEES.RESOLVER_BPS);
const DDR_BPS_BIGINT = BigInt(FEES.DDR_BPS);
const LPP_BPS_BIGINT = BigInt(FEES.LPP_BPS);

export function calculateFeeSplitOrig(
  rewardAmount: bigint,
  guildFeeBps: number = 0
) {
  const bpsDivisor = BigInt(10000);
  const protocolAmount = (rewardAmount * PROTOCOL_BPS_BIGINT) / bpsDivisor;

  const labsAmount = (LABS_BPS_BIGINT === PROTOCOL_BPS_BIGINT)
    ? protocolAmount
    : (rewardAmount * LABS_BPS_BIGINT) / bpsDivisor;

  const resolverAmount = (rewardAmount * RESOLVER_BPS_BIGINT) / bpsDivisor;
  const guildAmount = (rewardAmount * BigInt(guildFeeBps)) / bpsDivisor;
  const performerAmount =
    rewardAmount - protocolAmount - labsAmount - resolverAmount - guildAmount;

  return {
    performerAmount,
    protocolAmount,
    guildAmount,
    resolverAmount,
    labsAmount,
  };
}

export function calculateFeeSplitOpt(
  rewardAmount: bigint,
  guildFeeBps: number = 0
) {
  const bpsDivisor = 10000n; // Use literal

  // Can we do (rewardAmount * (PROTOCOL_BPS_BIGINT + LABS_BPS_BIGINT)) / bpsDivisor ?
  // Yes, but we need individual amounts.

  const protocolAmount = (rewardAmount * PROTOCOL_BPS_BIGINT) / bpsDivisor;

  const labsAmount = (LABS_BPS_BIGINT === PROTOCOL_BPS_BIGINT)
    ? protocolAmount
    : (rewardAmount * LABS_BPS_BIGINT) / bpsDivisor;

  const resolverAmount = (rewardAmount * RESOLVER_BPS_BIGINT) / bpsDivisor;
  const guildAmount = guildFeeBps === 0 ? 0n : (rewardAmount * BigInt(guildFeeBps)) / bpsDivisor;
  const performerAmount =
    rewardAmount - protocolAmount - labsAmount - resolverAmount - guildAmount;

  return {
    performerAmount,
    protocolAmount,
    guildAmount,
    resolverAmount,
    labsAmount,
  };
}

const reward = 1000000000n;
const start = performance.now();
for (let i = 0; i < 1000000; i++) {
  calculateFeeSplitOrig(reward, 0);
  calculateFeeSplitOrig(reward, 300);
}
console.log("Original:", performance.now() - start);

const start2 = performance.now();
for (let i = 0; i < 1000000; i++) {
  calculateFeeSplitOpt(reward, 0);
  calculateFeeSplitOpt(reward, 300);
}
console.log("Opt:", performance.now() - start2);
