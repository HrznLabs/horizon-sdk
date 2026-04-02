import { isMissionExpired } from '../src/utils/index';

const val = BigInt(Math.floor(Date.now() / 1000) + 3600);

const start = performance.now();
for (let i = 0; i < 100000; i++) {
  isMissionExpired(val);
}
console.log("Original:", performance.now() - start);
