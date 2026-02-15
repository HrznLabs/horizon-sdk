## 2024-05-22 - [Isomorphic Utilities]
**Learning:** SDK utility functions often rely on Node.js globals like `Buffer`, causing `ReferenceError` in browser environments. This creates poor Developer Experience (DX) for frontend consumers.
**Action:** Replace `Buffer` with `TextEncoder` and `Uint8Array` methods for string-to-bytes conversion to ensure browser compatibility without polyfills.

## 2024-05-22 - [Numeric Input Parsing]
**Learning:** `parseFloat` silently truncates input at the first non-numeric character (e.g., "1,000" becomes 1). In financial applications, this can lead to severe data loss and incorrect calculations without warning.
**Action:** Always strip non-numeric characters (like commas) and use strict regex validation (`/^-?(\d+(\.\d*)?|\.\d+)$/`) before parsing numbers to ensure data integrity.

## 2024-05-23 - [Currency Formatting UX]
**Learning:** Manual string construction for currency values (e.g. `${whole}.${fraction}`) fails for negative numbers (e.g. `-1.-500000`) and produces overly verbose output (e.g. `100.000000`). This confuses users and looks broken.
**Action:** Use `toLocaleString` for the integer part to add grouping (commas), handle negative signs explicitly, and trim unnecessary trailing zeros for cleaner, more human-readable display.
