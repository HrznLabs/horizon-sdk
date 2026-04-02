import { toBytes32 } from '../src/utils/index';

const start = performance.now();
for (let i = 0; i < 100000; i++) {
  toBytes32("0x1234");
  toBytes32("hello world");
}
console.log("Original:", performance.now() - start);
