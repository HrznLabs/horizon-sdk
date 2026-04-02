// Try to optimize getBaseScanUrl regex testing!
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

  // Let's use a custom hex validator instead of regex since the lengths are fixed and we can avoid the regex engine completely.
  if (len !== 42 && len !== 66) {
    throw new Error('Invalid address or transaction hash.');
  }

  if (hashOrAddress.charCodeAt(0) !== 48 || hashOrAddress.charCodeAt(1) !== 120) {
    throw new Error('Invalid address or transaction hash.');
  }

  // fast hex check loop
  for (let i = 2; i < len; i++) {
    const code = hashOrAddress.charCodeAt(i);
    // '0'-'9', 'a'-'f', 'A'-'F'
    // This is equivalent to code >= 48 && code <= 57 || code >= 97 && code <= 102 || code >= 65 && code <= 70
    // But we can optimize it slightly
    if (
        (code < 48 || code > 57) &&
        (code < 97 || code > 102) &&
        (code < 65 || code > 70)
    ) {
        throw new Error('Invalid address or transaction hash.');
    }
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
console.log("Opt:", performance.now() - start2);
