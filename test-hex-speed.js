const { toBytes32 } = require('./dist/index.js');
const hex = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

const start = performance.now();
for (let i = 0; i < 100000; i++) {
  toBytes32(hex);
}
const end = performance.now();
console.log(`Time: ${end - start} ms`);
