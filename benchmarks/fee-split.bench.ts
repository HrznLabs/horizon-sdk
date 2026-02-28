import { calculateFeeSplit } from '../src/utils/index';

const ITERATIONS = 1_000_000;
const REWARD = BigInt(1000000);

console.log(`Benchmarking calculateFeeSplit with ${ITERATIONS} iterations...`);

const start = performance.now();

for (let i = 0; i < ITERATIONS; i++) {
  calculateFeeSplit(REWARD, 300);
}

const end = performance.now();
console.log(`Total time: ${(end - start).toFixed(2)}ms`);
console.log(`Average time: ${((end - start) / ITERATIONS).toFixed(4)}ms`);
