const fs = require('fs');
let content = fs.readFileSync('src/utils/index.ts', 'utf-8');

const regexDef = `// Optimization: Hoisted regex for hex validation to avoid instantiation on every call
const HEX_REGEX = /^0x[0-9a-fA-F]+$/;`;

const newRegexDef = `// Optimization: Hoisted regex for hex validation to avoid instantiation on every call
// Modified to use * instead of + to support valid '0x' empty hex strings
const HEX_REGEX = /^0x[0-9a-fA-F]*$/;`;

content = content.replace(regexDef, newRegexDef);

const loopToReplace = `    // Validate hex characters
    // Optimization: Loop with charCodeAt and bitwise operators is ~15% faster than bounds checking.
    // (code ^ 48) > 9 checks for 0-9 digits.
    // (((code | 32) - 97) >>> 0) > 5 converts A-F to a-f, subtracts 'a', and uses unsigned right shift
    // to correctly identify non-hex characters including those with character codes < 97.
    let i = 2;
    for (; i < len; i++) {
      const code = str.charCodeAt(i);
      if ((code ^ 48) > 9 && (((code | 32) - 97) >>> 0) > 5) {
        break;
      }
    }
    if (i !== len) {
      throw new Error('Invalid hex string.');
    }`;

const newValidation = `    // Validate hex characters
    // Optimization: Pre-compiled regex is faster than manual charCodeAt loop in V8 for short hex strings
    if (!HEX_REGEX.test(str)) {
      throw new Error('Invalid hex string.');
    }`;

if (content.includes(loopToReplace)) {
  content = content.replace(loopToReplace, newValidation);
  fs.writeFileSync('src/utils/index.ts', content);
  console.log("Successfully updated toBytes32 to use HEX_REGEX");
} else {
  console.log("Could not find loop to replace");
}
