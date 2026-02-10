## 2024-05-22 - [Isomorphic Utilities]
**Learning:** SDK utility functions often rely on Node.js globals like `Buffer`, causing `ReferenceError` in browser environments. This creates poor Developer Experience (DX) for frontend consumers.
**Action:** Replace `Buffer` with `TextEncoder` and `Uint8Array` methods for string-to-bytes conversion to ensure browser compatibility without polyfills.

## 2024-06-15 - [Financial Input Parsing]
**Learning:** `parseFloat` is dangerous for financial SDK inputs as it silently ignores invalid trailing characters (e.g., "10abc" -> 10) and stops at commas ("1,000" -> 1), leading to confusing developer errors and potential fund loss.
**Action:** Always implement strict string-based parsing with regex validation (`/^-?(\d+|\d*\.\d+)$/`) for financial utilities, explicitly handling commas and rejecting malformed inputs instead of relying on loose coercion.
