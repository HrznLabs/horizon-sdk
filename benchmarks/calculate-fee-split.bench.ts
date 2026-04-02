import { calculateFeeSplit } from '../src/utils/index';

const reward = 1000000000n;
const start = performance.now();
for (let i = 0; i < 1000000; i++) {
  calculateFeeSplit(reward, 300);
}
console.log("Original:", performance.now() - start);
