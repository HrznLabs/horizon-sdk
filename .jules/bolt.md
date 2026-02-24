
## 2024-05-22 - Redundant Fee Calculation Optimization
**Learning:** Reusing calculated BigInt values in `calculateFeeSplit` when BPS constants are identical (Protocol & Labs) reduced execution time by ~20% (636ms -> 507ms for 1M iterations).
**Action:** Always check for redundant calculations in mathematical utility functions, especially those involving BigInt division which is relatively expensive.

## 2024-05-22 - Broken Regression Test Discovery
**Learning:** Regression tests may contain outdated expectations (e.g., hardcoded fee amounts based on old BPS values) that mask the true behavior of the code. In this case, `test/fee-split.test.ts` expected 400n (4%) but code produced 250n (2.5%), causing failure only when verified.
**Action:** When tests fail unexpectedly during optimization, verify if the test expectations align with the current constants/configuration before assuming the code is broken.

## 2024-05-22 - Hoisting Uint8Array for Random Bytes
**Learning:** Hoisting the `Uint8Array` buffer in `randomBytes32` to module scope (to avoid re-allocation on every call) yielded a ~24% speed improvement (466ms to 360ms for 100k iterations) by reducing garbage collection overhead.
**Action:** For high-frequency synchronous utility functions, consider reusing buffers or object pools if thread-safety (re-entrancy) is guaranteed.
