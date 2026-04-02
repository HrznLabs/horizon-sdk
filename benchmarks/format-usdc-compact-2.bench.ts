// Try to optimize formatUSDC compact string formatting
function testCompactOrig() {
  const fractionVal = 5n;
  let decimalPart = '';
  if (fractionVal > 0n) {
    if (fractionVal % 10n === 0n) {
       decimalPart = '.' + (fractionVal / 10n).toString();
    } else {
       decimalPart = fractionVal < 10n ? '.0' + fractionVal.toString() : '.' + fractionVal.toString();
    }
  }
  return decimalPart;
}

function testCompactOpt() {
  const fractionVal = 5n;
  // Let's use string concatenation differently
  if (fractionVal > 0n) {
    if (fractionVal % 10n === 0n) {
       return '.' + (fractionVal / 10n).toString();
    } else if (fractionVal < 10n) {
       return '.0' + fractionVal.toString();
    } else {
       return '.' + fractionVal.toString();
    }
  }
  return '';
}

const start1 = performance.now();
for (let i = 0; i < 1000000; i++) {
  testCompactOrig();
}
console.log("Original:", performance.now() - start1);

const start2 = performance.now();
for (let i = 0; i < 1000000; i++) {
  testCompactOpt();
}
console.log("Opt options check:", performance.now() - start2);
