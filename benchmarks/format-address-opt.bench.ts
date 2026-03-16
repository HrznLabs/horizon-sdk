const ITERATIONS = 10_000_000;
const address = '0x1234567890abcdef1234567890abcdef12345678';

function formatAddressOriginal(
  address: string,
  options?: { start?: number; end?: number }
): string {
  if (options) {
    const start = options.start ?? 6;
    const end = options.end ?? 4;
    const len = address.length;
    // If address is shorter than or equal to the truncated parts, return as is
    if (len <= start + end) return address;

    // Optimization: substring and direct string concatenation are faster than slice and template literals
    const endStr = end === 0 ? '' : address.substring(len - end);
    return address.substring(0, start) + '...' + endStr;
  }

  // Legacy behavior: Only truncate if strictly 42 chars (standard EVM address)
  if (address.length !== 42) return address;

  // Optimization: direct string concat and substring instead of slice
  return address.substring(0, 6) + '...' + address.substring(38);
}

function formatAddressSlice(
  address: string,
  options?: { start?: number; end?: number }
): string {
  if (options) {
    const start = options.start ?? 6;
    const end = options.end ?? 4;
    const len = address.length;
    if (len <= start + end) return address;
    const endStr = end === 0 ? '' : address.slice(-end);
    return address.slice(0, start) + '...' + endStr;
  }
  if (address.length !== 42) return address;
  return address.slice(0, 6) + '...' + address.slice(38);
}

let start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  formatAddressOriginal(address);
}
let end = performance.now();
console.log(`Original (substring) time: ${(end - start).toFixed(2)}ms`);

start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  formatAddressSlice(address);
}
end = performance.now();
console.log(`Slice time: ${(end - start).toFixed(2)}ms`);
