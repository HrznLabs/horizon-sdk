## 2025-02-17 - [BigInt Optimization Quirk]
**Learning:** Hoisting `BigInt` constants to module scope generally improves performance (e.g., 55% faster `formatUSDC`). However, in `calculateFeeSplit` (which performs multiple divisions), using a local `BigInt(10000)` was consistently faster (~55ms) than using a module-level `BPS_DIVISOR` constant (~91ms). This suggests V8 might optimize small integer BigInt literals better than module variable access in tight loops or specific contexts.
**Action:** Always benchmark optimizations. Don't assume hoisting is always faster for small primitives like `BigInt(10000)`. Test both local and module-scope approaches for hot paths.

## 2025-02-17 - [TextEncoder and Hex String Optimization]
**Learning:** Instantiating `TextEncoder` inside a hot function is significantly slower than hoisting it to module scope. Additionally, using `Array.from(bytes).map(...).join('')` for hex conversion is a major bottleneck (up to 7x slower). A pre-calculated lookup table (`HEX_STRINGS`) combined with a simple loop is much faster.
**Action:** Hoist `TextEncoder` instances for frequently called functions. Use lookup tables for byte-to-hex conversions instead of array methods.

## 2025-02-17 - [Safe Integer Parsing Performance]
**Learning:** For parsing financial amounts to BigInt, unsafe `parseFloat` is fast but loses precision for large numbers (> 2^53). Standard string splitting (`split('.')`) to implement safe parsing is relatively slow (~240ms). A manual string iteration approach provides correctness and strict validation while being significantly faster (~170ms) than splitting, though still slower than unsafe float operations (~146ms).
**Action:** When precise parsing is required, avoid `parseFloat`. Use manual string traversal instead of `split` or Regex for better performance in hot paths.

## 2025-02-17 - [String Formatting Performance]
**Learning:** `BigInt.toLocaleString('en-US')` is significantly slower (~2.7x) than a manual loop for inserting comma separators. While `toLocaleString` is robust for locale support, for fixed formatting requirements (like comma-separated thousands), manual string manipulation is much more performant.
**Action:** Avoid `toLocaleString` in performance-critical rendering loops if only simple comma formatting is needed. Use manual string manipulation instead.
