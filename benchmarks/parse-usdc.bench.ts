import { parseUSDC } from '../src/utils/index';

const start = performance.now();
for (let i = 0; i < 100000; i++) {
  parseUSDC("1234567890.123456");
  parseUSDC("999.99");
  parseUSDC("0.000001");
}
console.log("Original:", performance.now() - start);
