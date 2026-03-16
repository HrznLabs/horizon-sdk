const ITERATIONS = 1_000_000;
const address = '0x1234567890abcdef1234567890abcdef12345678';
const tx = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

const HEX_REGEX = /^0x[0-9a-fA-F]+$/;
const SEPOLIA_BASESCAN_URL = 'https://sepolia.basescan.org/';
const MAINNET_BASESCAN_URL = 'https://basescan.org/';

function getBaseScanUrlOriginal(
  hashOrAddress: string,
  type?: 'address' | 'tx',
  testnet: boolean = true
): string {
  const len = hashOrAddress.length;

  if ((len !== 42 && len !== 66) || !HEX_REGEX.test(hashOrAddress)) {
    throw new Error('Invalid address or transaction hash.');
  }

  if (type !== undefined && type !== 'address' && type !== 'tx') {
    throw new Error('Invalid type parameter.');
  }

  const baseUrl = testnet ? SEPOLIA_BASESCAN_URL : MAINNET_BASESCAN_URL;
  const pathType = type !== undefined ? type : (len === 42 ? 'address' : 'tx');

  return baseUrl + pathType + '/' + hashOrAddress;
}

// optimization: replace string concatenation with an array? No, string concatenation is faster in V8.
// Is there anything else? The journal says:
// "Performance Optimization: For short, frequently called URL construction utilities like getBaseScanUrl, combining input validation checks into a single short-circuiting expression (||) and using direct string concatenation (+) instead of ES6 template literals (${}) is significantly faster (~20% speedup) as it avoids template array creation and variable assignment overhead." -> Looks like this is already implemented!
