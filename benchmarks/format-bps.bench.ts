import { formatBps } from '../src/utils/index';

const start = performance.now();
for (let i = 0; i < 100000; i++) {
  formatBps(150);
  formatBps(150, { minDecimals: 2, prefix: "+", suffix: "%" });
  formatBps(0);
}
console.log("Original:", performance.now() - start);
