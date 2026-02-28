import { formatAddress } from '../src/utils/index';

const ITERATIONS = 1_000_000;
const address = '0x1234567890abcdef1234567890abcdef12345678';

console.log(`Benchmarking formatAddress with ${ITERATIONS} iterations...`);

const start = performance.now();

for (let i = 0; i < ITERATIONS; i++) {
  formatAddress(address);
}

const end = performance.now();
console.log(`Total time: ${(end - start).toFixed(2)}ms`);
console.log(`Average time: ${((end - start) / ITERATIONS).toFixed(4)}ms`);
