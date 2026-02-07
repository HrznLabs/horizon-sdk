## 2026-02-05 - Buffer vs Array.map for Hex Conversion
**Learning:** `Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')` is ~5x slower than `Buffer.from(bytes).toString('hex')` for 32-byte arrays in this environment.
**Action:** Prefer `Buffer.from().toString('hex')` for hex encoding when running in Node.js or compatible environments.
