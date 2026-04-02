import { calculateDDR, calculateLPP } from '../src/utils/index';

const reward = 1000000000n;
const start = performance.now();
for (let i = 0; i < 1000000; i++) {
  calculateDDR(reward);
  calculateLPP(reward);
}
console.log("Original:", performance.now() - start);
