const ITERATIONS = 1_000_000;
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

// In .jules/bolt.md: "Performance Optimization: For simple string truncations like in formatAddress, using substring with calculated lengths and direct string concatenation (+) is significantly faster (~40% execution time reduction) than using slice (especially with negative indices) and template literals." -> Looks like this optimization was already applied.
// Is there anything else? Let's check formatBps
