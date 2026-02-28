import { getBaseScanUrl } from '../src/utils/index';

const ITERATIONS = 1_000_000;
const address = '0x1234567890abcdef1234567890abcdef12345678';
const tx = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

console.log(`Benchmarking getBaseScanUrl with ${ITERATIONS} iterations...`);

const start = performance.now();

for (let i = 0; i < ITERATIONS; i++) {
  getBaseScanUrl(address);
  getBaseScanUrl(tx);
}

const end = performance.now();
console.log(`Total time: ${(end - start).toFixed(2)}ms`);
console.log(`Average time: ${((end - start) / ITERATIONS).toFixed(4)}ms`);
