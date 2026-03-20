import { formatUSDC } from '../src/utils/index';

const iterations = 1_000_000;
const amounts = [
  1_000_000_000n, // 1000.000000 -> 1000
  1_500_000n,     // 1.500000 -> 1.5
  123_450n,       // 0.123450 -> 0.12345
  1000n           // 0.001000 -> 0.001
];

console.log(`Running benchmark for ${iterations} iterations...`);

const start = performance.now();

for (let i = 0; i < iterations; i++) {
  // Use modulo to cycle through different trailing zero amounts
  formatUSDC(amounts[i % amounts.length]);
}

const end = performance.now();
const durationMs = end - start;

console.log(`Duration: ${durationMs.toFixed(2)} ms`);
console.log(`Average: ${(durationMs / iterations).toFixed(4)} ms per call`);
