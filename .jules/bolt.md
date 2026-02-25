
## 2024-05-22 - Redundant Fee Calculation Optimization
**Learning:** Reusing calculated BigInt values in `calculateFeeSplit` when BPS constants are identical (Protocol & Labs) reduced execution time by ~20% (636ms -> 507ms for 1M iterations).
**Action:** Always check for redundant calculations in mathematical utility functions, especially those involving BigInt division which is relatively expensive.

## 2024-05-22 - Broken Regression Test Discovery
**Learning:** Regression tests may contain outdated expectations (e.g., hardcoded fee amounts based on old BPS values) that mask the true behavior of the code. In this case, `test/fee-split.test.ts` expected 400n (4%) but code produced 250n (2.5%), causing failure only when verified.
**Action:** When tests fail unexpectedly during optimization, verify if the test expectations align with the current constants/configuration before assuming the code is broken.

## 2024-05-24 - Buffer Reuse in randomBytes32
**Learning:** `crypto.getRandomValues` fills the array in place. Reusing a module-level `Uint8Array` buffer instead of allocating a new one on every call reduced execution time by ~23% (4447ms -> 3417ms for 1M iterations) by eliminating GC overhead.
**Action:** When using `crypto.getRandomValues` in a synchronous, single-threaded context, prefer a reusable static buffer over per-call allocation.
