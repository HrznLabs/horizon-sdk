export function isMissionExpiredOrig(expiresAt: bigint): boolean {
  return Date.now() >= (Number(expiresAt) + 1) * 1000;
}

export function isMissionExpiredOpt(expiresAt: bigint): boolean {
  return Math.floor(Date.now() / 1000) > Number(expiresAt);
}

export function isMissionExpiredOpt2(expiresAt: bigint): boolean {
  return (Date.now() / 1000 | 0) > Number(expiresAt);
}

const val = BigInt(Math.floor(Date.now() / 1000) + 3600);

const start1 = performance.now();
for (let i = 0; i < 1000000; i++) {
  isMissionExpiredOrig(val);
}
console.log("Original:", performance.now() - start1);

const start2 = performance.now();
for (let i = 0; i < 1000000; i++) {
  isMissionExpiredOpt(val);
}
console.log("Opt Math.floor:", performance.now() - start2);

const start3 = performance.now();
for (let i = 0; i < 1000000; i++) {
  isMissionExpiredOpt2(val);
}
console.log("Opt bitwise:", performance.now() - start3);
