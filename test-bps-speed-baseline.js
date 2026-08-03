const { formatBps } = require('./dist/index.js');
const start = performance.now();
for (let i = 0; i < 100000; i++) {
  formatBps(150.5, { minDecimals: 4 });
}
const end = performance.now();
console.log(`Time: ${end - start} ms`);
