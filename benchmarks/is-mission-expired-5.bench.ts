export function isMissionExpiredOrig(expiresAt: bigint): boolean {
  return Date.now() >= (Number(expiresAt) + 1) * 1000;
}

export function isMissionExpiredOpt(expiresAt: bigint): boolean {
  // Let's use `Date.now() / 1000 | 0` logic from before
  // wait, Date.now() / 1000 could be a non-integer float
  // (Date.now() / 1000 | 0) truncates it to 32-bit int!
  // Current time is ~1730000000, which fits in 32-bit signed int (max 2147483647).
  // Will exceed in 2038.
  return Math.floor(Date.now() / 1000) > Number(expiresAt);
}

const val = BigInt(Math.floor(Date.now() / 1000) + 3600);

const start1 = performance.now();
for (let i = 0; i < 10000000; i++) {
  isMissionExpiredOrig(val);
}
console.log("Original:", performance.now() - start1);

const start2 = performance.now();
for (let i = 0; i < 10000000; i++) {
  isMissionExpiredOpt(val);
}
console.log("Opt Math.floor:", performance.now() - start2);
