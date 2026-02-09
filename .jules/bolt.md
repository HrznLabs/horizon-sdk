## 2025-02-17 - [BigInt Optimization Quirk]
**Learning:** Hoisting `BigInt` constants to module scope generally improves performance (e.g., 55% faster `formatUSDC`). However, in `calculateFeeSplit` (which performs multiple divisions), using a local `BigInt(10000)` was consistently faster (~55ms) than using a module-level `BPS_DIVISOR` constant (~91ms). This suggests V8 might optimize small integer BigInt literals better than module variable access in tight loops or specific contexts.
**Action:** Always benchmark optimizations. Don't assume hoisting is always faster for small primitives like `BigInt(10000)`. Test both local and module-scope approaches for hot paths.

## 2026-02-09 - [Hex String Conversion Optimization]
**Learning:** For converting `Uint8Array` to hex strings, using a pre-calculated `HEX_STRINGS` lookup table and a manual loop is significantly faster (2.5x - 7x speedup) than the idiomatic `Array.from().map().join('')` or even `Array.map().join('')`.
**Action:** Use a `HEX_STRINGS` lookup table for all byte-to-hex conversions in performance-critical paths like `toBytes32` or hash generation.
