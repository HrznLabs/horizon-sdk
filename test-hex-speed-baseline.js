const { toBytes32 } = require('./dist/index.js');
const hexes = ['0x1234567890abcdef1234567890abcdef', '0x12', '0x', '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'];

const start = performance.now();
for (let i = 0; i < 100000; i++) {
  toBytes32(hexes[i % hexes.length]);
}
const end = performance.now();
console.log(`Time: ${end - start} ms`);
