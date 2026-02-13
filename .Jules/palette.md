## 2024-05-22 - [Isomorphic Utilities]
**Learning:** SDK utility functions often rely on Node.js globals like `Buffer`, causing `ReferenceError` in browser environments. This creates poor Developer Experience (DX) for frontend consumers.
**Action:** Replace `Buffer` with `TextEncoder` and `Uint8Array` methods for string-to-bytes conversion to ensure browser compatibility without polyfills.

## 2024-05-22 - [Numeric Input Parsing]
**Learning:** `parseFloat` silently truncates input at the first non-numeric character (e.g., "1,000" becomes 1). In financial applications, this can lead to severe data loss and incorrect calculations without warning.
**Action:** Always strip non-numeric characters (like commas) and use strict regex validation (`/^-?(\d+(\.\d*)?|\.\d+)$/`) before parsing numbers to ensure data integrity.

## 2024-05-24 - [Currency Formatting UX]
**Learning:** Displaying raw BigInt values (e.g., `-1.-500000`) is confusing and potentially misleading for users. Explicitly formatting negative numbers and adding thousands separators significantly improves readability and user trust.
**Action:** Use manual string manipulation to format BigInt amounts, ensuring signs, commas, and decimals are handled correctly for display.
