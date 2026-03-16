const ITERATIONS = 10_000_000;
const expiresAt = BigInt(Math.floor(Date.now() / 1000) + 3600);

function isMissionExpiredOriginal(expiresAt: bigint): boolean {
  return Date.now() >= (Number(expiresAt) + 1) * 1000;
}

// Optimization: since Math.floor(Date.now() / 1000) is used everywhere, why not just:
// Date.now() / 1000 >= Number(expiresAt) ? It's not perfectly precise, but enough?
// Wait, Date.now() >= Number(expiresAt) * 1000 + 1000 ?

function isMissionExpiredNumberCmp(expiresAt: bigint): boolean {
  return Date.now() >= (Number(expiresAt) + 1) * 1000;
}

let start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  isMissionExpiredOriginal(expiresAt);
}
let end = performance.now();
console.log(`Original time: ${(end - start).toFixed(2)}ms`);
