import { formatUSDC } from '../src/utils/index';

const val1 = 1234567890123456n;
const val2 = 999990000n;
const val3 = 1n;

const start = performance.now();
for (let i = 0; i < 100000; i++) {
  formatUSDC(val1);
  formatUSDC(val2);
  formatUSDC(val3);
}
console.log("Original:", performance.now() - start);
