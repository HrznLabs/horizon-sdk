
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
