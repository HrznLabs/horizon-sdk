const ITERATIONS = 1_000_000;
const address = '0x1234567890abcdef1234567890abcdef12345678';
const tx = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

const ADDR_REGEX = /^0x[0-9a-fA-F]{40}$/;
const TX_REGEX = /^0x[0-9a-fA-F]{64}$/;

function getBaseScanUrlRegexHoisted(hashOrAddress: string, type?: 'address' | 'tx', testnet: boolean = true) {
  const isAddress = ADDR_REGEX.test(hashOrAddress);
  const isTx = TX_REGEX.test(hashOrAddress);

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
  getBaseScanUrlRegexHoisted(address);
  getBaseScanUrlRegexHoisted(tx);
}
let end = performance.now();
console.log(`Hoisted Regex time: ${(end - start).toFixed(2)}ms`);
