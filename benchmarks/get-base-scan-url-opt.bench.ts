const ITERATIONS = 1_000_000;
const address = '0x1234567890abcdef1234567890abcdef12345678';
const tx = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

function getBaseScanUrlRegex(hashOrAddress: string, type?: 'address' | 'tx', testnet: boolean = true) {
  const isAddress = /^0x[0-9a-fA-F]{40}$/.test(hashOrAddress);
  const isTx = /^0x[0-9a-fA-F]{64}$/.test(hashOrAddress);

  if (!isAddress && !isTx) {
    throw new Error('Invalid address or transaction hash.');
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

function getBaseScanUrlOpt(hashOrAddress: string, type?: 'address' | 'tx', testnet: boolean = true) {
  const len = hashOrAddress.length;
  let isAddress = false;
  let isTx = false;

  if (len === 42 || len === 66) {
    if (hashOrAddress.charCodeAt(0) === 48 && hashOrAddress.charCodeAt(1) === 120) { // '0x'
      let valid = true;
      for (let i = 2; i < len; i++) {
        const code = hashOrAddress.charCodeAt(i);
        if (!(code >= 48 && code <= 57) && // 0-9
            !(code >= 97 && code <= 102) && // a-f
            !(code >= 65 && code <= 70)) { // A-F
          valid = false;
          break;
        }
      }
      if (valid) {
        if (len === 42) isAddress = true;
        else isTx = true;
      }
    }
  }

  if (!isAddress && !isTx) {
    throw new Error('Invalid address or transaction hash.');
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
  getBaseScanUrlRegex(address);
  getBaseScanUrlRegex(tx);
}
let end = performance.now();
console.log(`Regex time: ${(end - start).toFixed(2)}ms`);

start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  getBaseScanUrlOpt(address);
  getBaseScanUrlOpt(tx);
}
end = performance.now();
console.log(`Optimized time: ${(end - start).toFixed(2)}ms`);
