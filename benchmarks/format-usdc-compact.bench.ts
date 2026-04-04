import { formatUSDC } from '../src/utils/index';

function runBenchmark() {
  const iterations = 1000000;

  // Format different amounts using compact mode
  const amounts = [
    500000000n, // 500
    1500000000n, // 1.5k
    2500000000000n, // 2.5m
    3500000000000000n, // 3.5b
    4500000000000000000n, // 4.5t
  ];

  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    for (const amount of amounts) {
      formatUSDC(amount, { compact: true });
    }
  }

  const end = performance.now();
  console.log(`Time taken for ${iterations} iterations (x${amounts.length} calls): ${(end - start).toFixed(2)} ms`);
}

runBenchmark();
