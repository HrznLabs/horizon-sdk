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

  // Optimization: By checking the 0x prefix before running the regex,
  // we can avoid invoking the regex engine for non-hex inputs
  // or short-circuit early on invalid lengths.
  if (
    (len !== 42 && len !== 66) ||
    hashOrAddress.charCodeAt(0) !== 48 ||
    hashOrAddress.charCodeAt(1) !== 120 ||
    !HEX_REGEX.test(hashOrAddress)
  ) {
    throw new Error('Invalid address or transaction hash.');
  }

  if (type !== undefined && type !== 'address' && type !== 'tx') {
    throw new Error('Invalid type parameter.');
  }

  const baseUrl = testnet ? SEPOLIA_BASESCAN_URL : MAINNET_BASESCAN_URL;
  const pathType = type !== undefined ? type : (len === 42 ? 'address' : 'tx');

  return baseUrl + pathType + '/' + hashOrAddress;
}

const addr1 = "0x1234567890abcdef1234567890abcdef12345678";
const tx1 = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

const start1 = performance.now();
for (let i = 0; i < 1000000; i++) {
  getBaseScanUrlOrig(addr1);
  getBaseScanUrlOrig(tx1);
}
console.log("Original:", performance.now() - start1);

const start2 = performance.now();
for (let i = 0; i < 1000000; i++) {
  getBaseScanUrlOpt(addr1);
  getBaseScanUrlOpt(tx1);
}
console.log("Opt early 0x check:", performance.now() - start2);
