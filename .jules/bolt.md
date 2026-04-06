
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

## 2026-03-14 - [String Concatenation in Return Statements]
**Learning:** In utility functions that format strings like `formatBps` and `formatUSDC`, replacing final return template literals (e.g., `` `${sign}${prefix}${wholeStr}${suffix}` ``) with direct string concatenation (`sign + prefix + wholeStr + suffix`) reduces execution time by ~25-40% depending on the function. This is consistent with previous learnings, as the V8 engine optimizes direct string concatenation heavily compared to the allocation overhead of parsing template arrays.
**Action:** Always prefer direct string concatenation (`+`) over template literals (`${}`) for simple variable joining in high-throughput formatting functions.

## 2024-12-05 - formatDuration Early Exit
**Learning:** In loops that subtract or divide down a value (like time formatting), once the value reaches zero, continuing to iterate through smaller units is wasted CPU time.
**Action:** Always add an early exit condition (`if (remaining === 0) break;`) to formatting loops to skip unnecessary iterations.

## 2024-12-06 - Hoist large BigInt constants
**Learning:** In utility functions called frequently, defining large `BigInt` constants inside a function body or `if` block forces the JavaScript engine to allocate and garbage-collect those values on every execution. Hoisting `BigInt` constants to the module scope avoids this overhead. In `formatUSDC` with `compact: true`, hoisting the K/M/B/T thresholds yielded a ~12% performance improvement.
**Action:** Always hoist static, immutable configuration data and large constants (`BigInt` values, regexes, complex arrays) to module scope instead of defining them locally inside high-throughput functions.

## 2025-05-27 - Pre-allocated substring for fixed-length padding
**Learning:** In utility functions where strings need to be padded to a fixed length (e.g., `toBytes32` padding to 66 chars), native `String.prototype.padEnd()` forces the JavaScript engine to perform bounds checks, calculate lengths, and dynamically allocate the padding string on every call. Using a hoisted, pre-allocated padding string (like `'0'.repeat(66)`) and manually appending a calculated `substring()` slice (`str + ZERO_PADDING.substring(0, 66 - len)`) avoids the repeated allocation overhead and is significantly faster (~4-6x improvement in micro-benchmarks).
**Action:** When fixed-length padding is required in high-throughput functions, prefer using pre-allocated strings with manual `substring()` concatenation over native `padEnd()` or `padStart()`.
