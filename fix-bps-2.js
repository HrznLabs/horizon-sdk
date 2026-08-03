const fs = require('fs');
let content = fs.readFileSync('src/utils/index.ts', 'utf-8');

const searchDuplicate = `  let minDecimals = options?.minDecimals || 0;
  if (minDecimals > MAX_DECIMALS) minDecimals = MAX_DECIMALS;

  // Optimization: Short-circuit zero to bypass string allocation and math entirely
  if (bps === 0) {
    if (minDecimals === 0) return prefix + '0' + suffix;
    return prefix + '0.' + ZEROES.substring(0, minDecimals) + suffix;
  }`;

const replaceDuplicate = `  let minDecimals = options?.minDecimals || 0;
  if (minDecimals > MAX_DECIMALS) minDecimals = MAX_DECIMALS;`;

if (content.includes(searchDuplicate)) {
  content = content.replace(searchDuplicate, replaceDuplicate);
  fs.writeFileSync('src/utils/index.ts', content);
  console.log("Removed duplicate check");
} else {
  console.log("Duplicate check not found");
}
