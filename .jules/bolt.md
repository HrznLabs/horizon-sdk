# Bolt's Journal ⚡

## 2024-05-23 - [Initial Setup]
**Learning:** Performance optimizations should be measured. Micro-optimizations in hot paths (like BigInt creation) can add up.
**Action:** Always verify with benchmarks.

## 2026-02-05 - Buffer vs Array.map for Hex Conversion
**Learning:** `Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')` is ~5x slower than `Buffer.from(bytes).toString('hex')` for 32-byte arrays in this environment.
**Action:** Prefer `Buffer.from().toString('hex')` for hex encoding when running in Node.js or compatible environments.
