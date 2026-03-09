
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

## 2024-05-25 - substring vs slice and template literals
**Learning:** For string formatting operations, combining `String.substring` and simple string concatenation (`+`) can be ~20% faster than using `String.slice` with negative indices and template literals. V8 seems to optimize direct string concatenation and `substring` operations well for shorter strings, avoiding the overhead of parsing negative indices and evaluating template literals.
**Action:** When working on formatting short strings (like Ethereum addresses), favor `substring` and string concatenation (`+`) over `slice` and template literals for better performance, particularly in hot utility functions.

## 2024-05-26 - Fast O(1) checks before Regex evaluations
**Learning:** In `getBaseScanUrl`, replacing length-specific regex evaluations (`/^0x[0-9a-fA-F]{40}$/` and `/^0x[0-9a-fA-F]{64}$/`) with a fast $O(1)$ string `.length` check followed by a single, hoisted, length-agnostic regex (`/^0x[0-9a-fA-F]+$/`) resulted in a ~4.7x speedup (1200ms -> 250ms for 1,000,000 operations). The $O(1)$ check prevents the regex engine from running at all for inputs of invalid length.
**Action:** When validating string patterns that include strict length requirements, always evaluate `.length` first as a fast-path guard clause before invoking the regex engine.

## 2024-05-27 - Pure Numeric Calculations vs String Manipulation in Formatting
**Learning:** In `formatUSDC` compact formatting, replacing string allocations and loops (`toString()`, `padStart()`, `substring()`, `while` zero-trimming) with pure numeric calculations (division/modulo and Number formatting logic) improves execution time by ~45% (e.g. 1684ms -> 927ms for 1,000,000 operations) and reduces memory overhead by avoiding intermediate string objects. Hoisting large numeric constants (e.g., millions/billions scaled) to module scope also contributes by avoiding repetitive initializations.
**Action:** When calculating and formatting small fractional or decimal values, prefer pure numerical checks and string template concatenation based on math conditions over using native string padding/trimming functions.

## 2026-03-05 - Array Building vs Direct String Concatenation in Formatting
**Learning:** In `formatDuration`, replacing array allocation (`result.push()`) and joining (`result.join(' ')`) with a standard `for` loop and direct string concatenation (`+=`) reduced execution time by ~50% (800ms -> 393ms for 1M iterations) by avoiding intermediate array allocations and simplifying memory management during string construction.
**Action:** When iteratively building short strings, prefer traditional loops and direct string concatenation (`+=`) over pushing to an array and using `.join()`.

## 2026-03-05 - Avoid Slice and Template Literals in String Formatting Loops
**Learning:** In the comma insertion loop of `formatUSDC`, replacing `String.slice` with `String.substring`, avoiding variable reassignment (`let start = len % 3; if (start === 0) start = 3;` to `const mod = len % 3; const start = mod === 0 ? 3 : mod;`), and returning with direct string concatenation instead of template literals reduced execution time by ~15% (e.g., 214ms -> 183ms for 1,000,000 operations). V8 optimizes native string concatenation (`+`) and `substring()` slightly better than parsing template literals and `slice()` for building strings chunk by chunk.
**Action:** In highly-called string formatting functions where arrays or objects aren't strictly necessary, prefer standard `substring()` and string concatenation (`+`) over `slice()` and template literals. Keep intermediate variables `const` to help optimization if possible.

## 2026-03-05 - Avoid Regex and String Allocations for Hex Validation
**Learning:** In `toBytes32`, replacing `str.startsWith('0x')` and regex `.test` hex validation (`/^[0-9a-fA-F]*$/`) with `charCodeAt` evaluations and a direct iteration over characters to check code points reduced execution time by over ~20% (e.g. 197ms -> 156ms for 1,000,000 operations). Avoiding `slice` and `substring` specifically when the substring is only needed for the `.test()` regex avoids unnecessary string allocation overhead.
**Action:** When validating a short string for character set constraints (e.g., hex only) before further parsing, prefer `charCodeAt` direct loops over regex and substring creations, especially in high-volume utility functions.

## 2026-03-05 - String Concatenation vs Template Literals in formatBps
**Learning:** In the `formatBps` utility, returning with simple string concatenation (`sign + prefix + formatted + suffix`) instead of template literals (`` `${sign}${prefix}${formatted}${suffix}` ``) resulted in a ~15-20% execution time reduction (e.g. 297ms -> 240ms for 1,000,000 iterations). V8 optimizes native string concatenation (`+`) more effectively for simple, short strings than evaluating template literals, which parse expressions and convert intermediate primitives.
**Action:** When building straightforward, small output strings without complex internal logic, favor standard string concatenation (`+`) over template literals for minor performance wins in hot paths.
