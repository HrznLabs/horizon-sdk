
const { parseUSDC } = require('./dist/index.js');

try {
  const largeStr = '9007199254740993';
  const result = parseUSDC(largeStr);
  console.log(`Input: ${largeStr}`);
  console.log(`Output: ${result}`);
  if (result !== 9007199254740993000000n) {
    console.error('FAIL: Precision lost!');
    process.exit(1);
  } else {
    console.log('PASS: Precision maintained.');
  }
} catch (e) {
  console.error(e);
}
