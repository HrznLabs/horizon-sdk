
import { formatDuration } from '../src/utils/index';

const ITERATIONS = 1_000_000;

console.log(`Benchmarking formatDuration with ${ITERATIONS} iterations...`);

const start = performance.now();

for (let i = 0; i < ITERATIONS; i++) {
  formatDuration(3661); // 1h 1m 1s
  formatDuration(3661, { style: 'long' });
}

const end = performance.now();
console.log(`Total time: ${(end - start).toFixed(2)}ms`);
console.log(`Average time: ${((end - start) / ITERATIONS).toFixed(4)}ms`);
