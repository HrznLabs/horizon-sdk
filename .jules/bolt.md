## 2025-02-17 - [BigInt Optimization Quirk]
**Learning:** Hoisting `BigInt` constants to module scope generally improves performance (e.g., 55% faster `formatUSDC`). However, in `calculateFeeSplit` (which performs multiple divisions), using a local `BigInt(10000)` was consistently faster (~55ms) than using a module-level `BPS_DIVISOR` constant (~91ms). This suggests V8 might optimize small integer BigInt literals better than module variable access in tight loops or specific contexts.
**Action:** Always benchmark optimizations. Don't assume hoisting is always faster for small primitives like `BigInt(10000)`. Test both local and module-scope approaches for hot paths.

## 2025-02-18 - [Optimizing Hex Conversion]
**Learning:** Converting bytes to hex strings using `Array.from(bytes).map(...).join('')` is significantly slower (2.5x - 7.5x depending on input) than using a pre-calculated lookup table (`HEX_STRINGS`) and a simple loop, due to array allocation and function call overhead.
**Action:** Always prefer loop + lookup table for byte-to-hex conversion in performance-critical paths.
