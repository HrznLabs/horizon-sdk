// Try to optimize regex test by combining it with length checks in a single logic block without regex
const SEPOLIA_BASESCAN_URL = 'https://sepolia.basescan.org/';
const MAINNET_BASESCAN_URL = 'https://basescan.org/';
const HEX_REGEX = /^0x[0-9a-fA-F]+$/;

function getBaseScanUrlOrig(
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

function getBaseScanUrlOpt(
  hashOrAddress: string,
  type?: 'address' | 'tx',
  testnet: boolean = true
): string {
  const len = hashOrAddress.length;

  // Let's do charCodeAt for length + regex in one condition.
  // Wait, no. The memory journal says:
  // "Using multiple regex checks with length quantifiers (like /^0x[0-9a-fA-F]{40}$/ and /^0x[0-9a-fA-F]{64}$/) inside frequently called functions creates significant instantiation overhead... By moving the length check to an O(1) fast check (len === 42 || len === 66), and hoisting a generic hexadecimal regex (/^0x[0-9a-fA-F]+$/), we avoid allocating two new Regex instances per call and provide an early bypass for incorrectly-sized inputs."
  // Wait, it says they already DID this optimization!
  // And indeed, the current code has it: `if ((len !== 42 && len !== 66) || !HEX_REGEX.test(hashOrAddress))`
  // This is what the journal refers to. The code is already optimal based on the journal!

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
