function formatAddressOrig(
  address: string,
  options?: { start?: number; end?: number }
): string {
  if (options) {
    const start = options.start ?? 6;
    const end = options.end ?? 4;
    const len = address.length;
    if (len <= start + end) return address;

    const endStr = end === 0 ? '' : address.substring(len - end);
    return address.substring(0, start) + '...' + endStr;
  }

  if (address.length !== 42) return address;

  return address.substring(0, 6) + '...' + address.substring(38);
}

function formatAddressOpt(
  address: string,
  options?: { start?: number; end?: number }
): string {
  if (options) {
    // avoid options chaining??
    const start = options.start !== undefined ? options.start : 6;
    const end = options.end !== undefined ? options.end : 4;
    const len = address.length;
    if (len <= start + end) return address;

    // Use string concatenation
    if (end === 0) return address.substring(0, start) + '...';
    return address.substring(0, start) + '...' + address.substring(len - end);
  }

  if (address.length !== 42) return address;

  return address.substring(0, 6) + '...' + address.substring(38);
}

const addr1 = "0x1234567890abcdef1234567890abcdef12345678";
const addr2 = "0xshort";

const start1 = performance.now();
for (let i = 0; i < 1000000; i++) {
  formatAddressOrig(addr1);
  formatAddressOrig(addr2, { start: 2, end: 2 });
}
console.log("Original:", performance.now() - start1);

const start2 = performance.now();
for (let i = 0; i < 1000000; i++) {
  formatAddressOpt(addr1);
  formatAddressOpt(addr2, { start: 2, end: 2 });
}
console.log("Opt:", performance.now() - start2);
