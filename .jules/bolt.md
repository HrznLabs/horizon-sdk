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

## 2025-05-20 - [BigInt Parsing Performance]
**Learning:** For parsing fixed-point decimals (like USDC), mathematically constructing the BigInt (using `intPart * multiplier + fracPart * power`) is ~14% faster than string manipulation (`padEnd` + concatenation) followed by `BigInt(string)`.
**Action:** When parsing decimals to BigInt in hot paths, prefer mathematical construction over string manipulation to avoid allocation overhead.

## 2025-05-20 - [Optimized String Trimming]
**Learning:** Using `regex.replace(/0+$/, '')` to trim trailing zeros is significantly slower (~60%) than a manual loop iterating backwards from the end of the string. Regex compilation and execution overhead is high for simple character matching tasks. Additionally, for integer amounts where the fraction is zero, skipping string operations entirely (via an early return) provides a massive speedup.
**Action:** Prefer manual loops over regex for simple string trimming operations in hot paths. Always look for early returns for common cases (like zero) to avoid unnecessary allocations.

## 2025-05-20 - [Optimized Expiration Check]
**Learning:** In `isMissionExpired`, comparing `BigInt(Math.floor(Date.now() / 1000))` against `bigint` expiration is slower than comparing `Date.now()` (number) against `(Number(expiresAt) + 1) * 1000`. The latter avoids floating point division, floor operation, and `BigInt` allocation, resulting in a ~30% speedup.
**Action:** For simple timestamp comparisons where seconds precision is sufficient, prefer transforming the comparison to avoid `BigInt` and division in hot paths.
## 2024-05-22 - Avoid split() for simple checks
**Learning:** Using `String.split('.')` just to check the length of a substring creates unnecessary array and string allocations.
**Action:** Use `String.indexOf('.')` and math for length checks instead. It benchmarked ~46% faster for `formatBps`.

## 2025-05-22 - [Optimized Character Validation]
**Learning:** In manual string validation loops (like `parseUSDC`), prioritizing the most common case (digits) at the start of the loop can significantly improve performance (~12-20%) by avoiding multiple checks for rare invalid characters.
**Action:** When iterating over strings for validation, always check for the expected valid range (e.g., `0-9`) first and `continue` to skip error handling logic.
