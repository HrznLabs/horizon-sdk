## 2024-05-22 - [Isomorphic Utilities]
**Learning:** SDK utility functions often rely on Node.js globals like `Buffer`, causing `ReferenceError` in browser environments. This creates poor Developer Experience (DX) for frontend consumers.
**Action:** Replace `Buffer` with `TextEncoder` and `Uint8Array` methods for string-to-bytes conversion to ensure browser compatibility without polyfills.

## 2024-05-24 - SDK UX vs Logic
**Learning:** For backend SDKs without UI, "UX" improvements should focus on output formatting (e.g., human-readable strings) rather than strict input validation logic, which can be seen as backend/security work.
**Action:** When working on SDKs, look for  functions to improve readability (commas, truncation) instead of changing parsing logic.

## 2024-05-24 - SDK UX vs Logic
**Learning:** For backend SDKs without UI, "UX" improvements should focus on output formatting (e.g., human-readable strings) rather than strict input validation logic, which can be seen as backend/security work.
**Action:** When working on SDKs, look for `format*` functions to improve readability (commas, truncation) instead of changing parsing logic.
