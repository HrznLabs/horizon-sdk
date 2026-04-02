const PROTOCOL_BPS_BIGINT = 250n;
const LABS_BPS_BIGINT = 250n;
const RESOLVER_BPS_BIGINT = 200n;
const DDR_BPS_BIGINT = 500n;
const LPP_BPS_BIGINT = 200n;

export function calculateFeeSplitOrig(
  rewardAmount: bigint,
  guildFeeBps: number = 0
) {
  const bpsDivisor = 10000n;
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
  // Optimization: Pre-divide rewardAmount if it's divisible by 10000n?
  // Reward amount is USDC base units, so 1 USDC = 1,000,000n.
  // 1,000,000n is divisible by 10,000n.
  // Wait, if rewardAmount is 1.5 USDC, it's 1,500,000n.
  // Let's just do `const base = rewardAmount / 10000n`
  // But wait, what if rewardAmount is 5000n (0.005 USDC)?
  // 5000n / 10000n = 0n. Then 0n * 250n = 0n.
  // Original is (5000n * 250n) / 10000n = 1250000n / 10000n = 125n.
  // Precision loss! Can't do that.

  const protocolAmount = (rewardAmount * PROTOCOL_BPS_BIGINT) / 10000n;

  const labsAmount = (LABS_BPS_BIGINT === PROTOCOL_BPS_BIGINT)
    ? protocolAmount
    : (rewardAmount * LABS_BPS_BIGINT) / 10000n;

  const resolverAmount = (rewardAmount * RESOLVER_BPS_BIGINT) / 10000n;
  const guildAmount = guildFeeBps === 0 ? 0n : (rewardAmount * BigInt(guildFeeBps)) / 10000n;
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
