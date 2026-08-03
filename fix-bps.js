const fs = require('fs');
const content = fs.readFileSync('src/utils/index.ts', 'utf-8');

const search = `  if (minDecimals > 0) {
    // Optimization: Avoid creating an array with split()
    const dotIndex = formatted.indexOf('.');
    const decimals = dotIndex === -1 ? 0 : formatted.length - dotIndex - 1;
    if (decimals < minDecimals) {
      // Optimization: direct string concatenation with pre-allocated ZEROES string
      // is significantly faster (~3-4x) than using native \`.toFixed(minDecimals)\`
      if (dotIndex === -1) {
        formatted += '.' + ZEROES.substring(0, minDecimals);
      } else {
        formatted += ZEROES.substring(0, minDecimals - decimals);
      }
    }
  }`;

const replace = `  if (minDecimals > 0) {
    // Optimization: Avoid creating an array with split()
    const dotIndex = formatted.indexOf('.');
    if (dotIndex === -1) {
      formatted += '.' + ZEROES.substring(0, minDecimals);
    } else {
      const decimals = formatted.length - dotIndex - 1;
      if (decimals < minDecimals) {
        formatted += ZEROES.substring(0, minDecimals - decimals);
      }
    }
  }`;

if (content.includes(search)) {
  fs.writeFileSync('src/utils/index.ts', content.replace(search, replace));
  console.log("Replaced successfully");
} else {
  console.log("Could not find block");
}
