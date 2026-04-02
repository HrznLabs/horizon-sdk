import { calculateExpiresAt } from '../src/utils/index';

const start = performance.now();
for (let i = 0; i < 100000; i++) {
  calculateExpiresAt(3600);
}
console.log("Original:", performance.now() - start);
