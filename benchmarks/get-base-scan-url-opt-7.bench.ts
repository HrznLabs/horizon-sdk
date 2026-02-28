const ITERATIONS = 1_000_000;
const address = '0x1234567890abcdef1234567890abcdef12345678';
const tx = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
const invalid = '0x1234567890abcdef1234567890abcdef123456ZZ';

function getBaseScanUrlOriginal(hashOrAddress: string, type?: 'address' | 'tx', testnet: boolean = true) {
  const isAddress = /^0x[0-9a-fA-F]{40}$/.test(hashOrAddress);
  const isTx = /^0x[0-9a-fA-F]{64}$/.test(hashOrAddress);

  if (!isAddress && !isTx) {
    // we want to measure happy path, so ignoring exceptions for benchmark purposes
  }

  const baseUrl = testnet
    ? 'https://sepolia.basescan.org'
    : 'https://basescan.org';

  let resolvedType = type;
  if (!resolvedType) {
    resolvedType = isTx ? 'tx' : 'address';
  }

  return `${baseUrl}/${resolvedType}/${hashOrAddress}`;
}

const HEX_REGEX = /^0x[0-9a-fA-F]+$/;

function getBaseScanUrlOptFast(hashOrAddress: string, type?: 'address' | 'tx', testnet: boolean = true) {
  const len = hashOrAddress.length;
  let isAddress = false;
  let isTx = false;

  if (len === 42 || len === 66) {
    if (HEX_REGEX.test(hashOrAddress)) {
      if (len === 42) isAddress = true;
      else isTx = true;
    }
  }

  if (!isAddress && !isTx) {
    // we want to measure happy path, so ignoring exceptions for benchmark purposes
  }

  const baseUrl = testnet
    ? 'https://sepolia.basescan.org'
    : 'https://basescan.org';

  let resolvedType = type;
  if (!resolvedType) {
    resolvedType = isTx ? 'tx' : 'address';
  }

  return `${baseUrl}/${resolvedType}/${hashOrAddress}`;
}

let start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  getBaseScanUrlOptFast(address);
  getBaseScanUrlOptFast(tx);
  getBaseScanUrlOptFast(invalid);
}
let end = performance.now();
console.log(`Optimized single regex time: ${(end - start).toFixed(2)}ms`);

start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  getBaseScanUrlOriginal(address);
  getBaseScanUrlOriginal(tx);
  getBaseScanUrlOriginal(invalid);
}
end = performance.now();
console.log(`Original time: ${(end - start).toFixed(2)}ms`);
