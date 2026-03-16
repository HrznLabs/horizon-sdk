const ITERATIONS = 10_000_000;
const expiresAt = BigInt(Math.floor(Date.now() / 1000) + 3600);

function isMissionExpiredOriginal(expiresAt: bigint): boolean {
  return Date.now() >= (Number(expiresAt) + 1) * 1000;
}

function isMissionExpiredBigInt(expiresAt: bigint): boolean {
  return BigInt(Math.floor(Date.now() / 1000)) >= expiresAt;
}

let start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  isMissionExpiredOriginal(expiresAt);
}
let end = performance.now();
console.log(`Original time: ${(end - start).toFixed(2)}ms`);

start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  isMissionExpiredBigInt(expiresAt);
}
end = performance.now();
console.log(`BigInt time: ${(end - start).toFixed(2)}ms`);
