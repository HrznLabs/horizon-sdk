
## 2024-05-22 - Redundant Fee Calculation Optimization
**Learning:** Reusing calculated BigInt values in `calculateFeeSplit` when BPS constants are identical (Protocol & Labs) reduced execution time by ~20% (636ms -> 507ms for 1M iterations).
**Action:** Always check for redundant calculations in mathematical utility functions, especially those involving BigInt division which is relatively expensive.

## 2024-05-22 - Broken Regression Test Discovery
**Learning:** Regression tests may contain outdated expectations (e.g., hardcoded fee amounts based on old BPS values) that mask the true behavior of the code. In this case, `test/fee-split.test.ts` expected 400n (4%) but code produced 250n (2.5%), causing failure only when verified.
**Action:** When tests fail unexpectedly during optimization, verify if the test expectations align with the current constants/configuration before assuming the code is broken.

## 2024-05-23 - Uint8Array Hoisting in randomBytes32
**Learning:** Hoisting a `Uint8Array` buffer to module scope in `randomBytes32` to avoid repeated allocation reduced execution time by ~21% (461ms -> 364ms for 100k iterations).
**Action:** Look for other utility functions that allocate buffers or arrays repeatedly in hot paths and hoist them if thread-safety permits.

## 2024-05-24 - Pre-allocation of Constants in formatDuration
**Learning:** Hoisting configuration objects (like `TIME_UNITS`) to module scope in `formatDuration` avoids allocating new objects and arrays on every function call. While unrolling the loop provided slightly better micro-benchmark results (~17% improvement), the readability cost was deemed too high. Pre-allocating the arrays provided a balanced optimization by reducing GC pressure without sacrificing code clarity.
**Action:** Identify functions that re-create static configuration objects/arrays on every invocation and hoist them to module scope.

## $(date +%Y-%m-%d) - [Optimize getBaseScanUrl regex]
**Learning:** Using multiple regex checks with length quantifiers (like `/^0x[0-9a-fA-F]{40}$/` and `/^0x[0-9a-fA-F]{64}$/`) inside frequently called functions creates significant instantiation overhead and forces the regex engine to parse both the string contents and its length. By moving the length check to an $O(1)$ fast check (`len === 42 || len === 66`), and hoisting a generic hexadecimal regex (`/^0x[0-9a-fA-F]+$/`), we avoid allocating two new Regex instances per call and provide an early bypass for incorrectly-sized inputs.
**Action:** Always hoist generic string-validation regular expressions and rely on explicit conditional branching (`if`, `switch`) for length-based constraints rather than encoding length logic into the pattern itself if it occurs in a hot path.

## 2024-05-25 - Substring & Concatenation > Slice & Template Literals
**Learning:** Using `substring` and direct string concatenation (`+`) instead of `slice` (specifically negative slice like `slice(-4)`) and template literals reduces execution time significantly (~40% reduction for `formatAddress` in micro-benchmarks). The V8 engine optimizes `substring` and `+` more effectively for these specific types of common string manipulations.
**Action:** When writing high-throughput functions that perform simple string truncation and concatenation, prefer `substring` with calculated lengths and direct `+` concatenation over `slice` with negative indices and template literals.

## 2024-05-15 - [formatDuration Array Join vs String Concatenation]
**Learning:** In highly-called utility functions formatting strings (like `formatDuration`), repeatedly allocating array elements using `.push()` and then joining them via `.join(' ')` incurs a significant performance overhead compared to straightforward string concatenation (`+=`).
**Action:** Default to simple string operations (concatenation, `substring`) over array allocations or complex methods for performance-critical string builders in this codebase. Always add quick checks to skip math operations where possible.

## 2024-12-04 - [Optimize getBaseScanUrl Construction]
**Learning:** For short, frequently called URL construction utilities like `getBaseScanUrl`, combining input validation checks into a single short-circuiting expression (`||`) and using direct string concatenation (`+`) instead of ES6 template literals (`${}`) is significantly faster. In Node.js / V8, simple string concatenation avoids the overhead of creating template arrays and parsing nested variables. Combining boolean validations also avoids variable assignment overhead, increasing execution speed by ~20%.
**Action:** Default to boolean operators `||` for chained fast-fail validations. Default to direct string concatenation instead of template strings for simple URL or path construction in high-frequency utilities.

## 2024-12-06 - formatUSDC Numeric Trimming
**Learning:** For trailing zero trimming, pure numeric calculations (division by 10) significantly outperform string-based zero-padding and loops. Avoiding `padStart` up-front and avoiding substring operations reduced execution time and GC overhead in the `formatUSDC` non-compact path.
**Action:** When truncating trailing zeros or calculating lengths, prefer math operations (`% 10` and `/ 10`) over allocating formatted strings and looping over their characters.
