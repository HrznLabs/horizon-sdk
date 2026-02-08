## 2024-05-22 - [Isomorphic Utilities]
**Learning:** SDK utility functions often rely on Node.js globals like `Buffer`, causing `ReferenceError` in browser environments. This creates poor Developer Experience (DX) for frontend consumers.
**Action:** Replace `Buffer` with `TextEncoder` and `Uint8Array` methods for string-to-bytes conversion to ensure browser compatibility without polyfills.

## 2024-05-23 - [Strict Input Validation]
**Learning:** Lenient parsing of financial inputs (e.g., `parseFloat("10.5abc")` -> 10.5) leads to silent errors and user frustration when invalid data is processed incorrectly.
**Action:** Use strict regex validation for input strings in utility functions to provide immediate, descriptive feedback on malformed inputs.
