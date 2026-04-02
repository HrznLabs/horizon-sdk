export function isMissionExpiredOrig(expiresAt: bigint): boolean {
  return Date.now() >= (Number(expiresAt) + 1) * 1000;
}

export function isMissionExpiredOpt(expiresAt: bigint): boolean {
  // Let's test the inverse: Math.floor(Date.now() / 1000) > Number(expiresAt)
  // Wait, Date.now() returns time in ms.
  // Number(expiresAt) + 1 is the next second. * 1000 makes it the first ms of the next second.
  // Date.now() >= that means Date.now() / 1000 >= Number(expiresAt) + 1
  // Or (Date.now() / 1000) - 1 >= Number(expiresAt)
  // Which is equivalent to Math.floor(Date.now() / 1000) > Number(expiresAt)
  return Math.floor(Date.now() / 1000) > Number(expiresAt);
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
console.log("Opt:", performance.now() - start2);
