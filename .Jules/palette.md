## 2024-05-22 - [Isomorphic Utilities]
**Learning:** SDK utility functions often rely on Node.js globals like `Buffer`, causing `ReferenceError` in browser environments. This creates poor Developer Experience (DX) for frontend consumers.
**Action:** Replace `Buffer` with `TextEncoder` and `Uint8Array` methods for string-to-bytes conversion to ensure browser compatibility without polyfills.

## 2024-05-22 - [Numeric Input Parsing]
**Learning:** `parseFloat` silently truncates input at the first non-numeric character (e.g., "1,000" becomes 1). In financial applications, this can lead to severe data loss and incorrect calculations without warning.
**Action:** Always strip non-numeric characters (like commas) and use strict regex validation (`/^-?(\d+(\.\d*)?|\.\d+)$/`) before parsing numbers to ensure data integrity.

## 2024-05-23 - [Human-Readable Currency Formatting]
**Learning:** Raw `BigInt` formatting (e.g., `1000.000000`) is technically correct but visually noisy and hard to read. Developers expect `formatUSDC` to output "display-ready" strings.
**Action:** Use `BigInt.prototype.toLocaleString` for comma separation and trim trailing zeros from decimals to create cleaner, more intuitive currency displays (e.g., "1,000.5" instead of "1000.500000").
