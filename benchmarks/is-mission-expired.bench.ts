import { isMissionExpired } from '../src/utils/index';

const ITERATIONS = 1_000_000;
const expiresAt = BigInt(Math.floor(Date.now() / 1000) + 3600);

console.log(`Benchmarking isMissionExpired with ${ITERATIONS} iterations...`);

const start = performance.now();

for (let i = 0; i < ITERATIONS; i++) {
  isMissionExpired(expiresAt);
}

const end = performance.now();
console.log(`Total time: ${(end - start).toFixed(2)}ms`);
console.log(`Average time: ${((end - start) / ITERATIONS).toFixed(4)}ms`);
