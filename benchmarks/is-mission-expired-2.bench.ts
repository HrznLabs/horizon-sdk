export function isMissionExpiredOrig(expiresAt: bigint): boolean {
  return Date.now() >= (Number(expiresAt) + 1) * 1000;
}

export function isMissionExpiredOpt(expiresAt: bigint): boolean {
  // Can we avoid the `+ 1` and `* 1000` on the BigInt side by dividing Date.now() by 1000?
  // Math.floor(Date.now() / 1000) >= Number(expiresAt)
  // Wait, the original code is Date.now() >= (Number(expiresAt) + 1) * 1000
  // which means it expires if Date.now() is strictly greater than the last millisecond of the expiresAt second.
  // Wait, if expiresAt = 100, then it expires if Date.now() >= 101000.
  // If Date.now() is 100999, it is NOT expired.
  // So yes, it means Math.floor(Date.now() / 1000) > Number(expiresAt)
  return Date.now() >= (Number(expiresAt) + 1) * 1000;
}

const val = BigInt(Math.floor(Date.now() / 1000) + 3600);

const start1 = performance.now();
for (let i = 0; i < 1000000; i++) {
  isMissionExpiredOrig(val);
}
console.log("Original:", performance.now() - start1);
