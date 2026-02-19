## 2024-05-22 - [Isomorphic Utilities]
**Learning:** SDK utility functions often rely on Node.js globals like `Buffer`, causing `ReferenceError` in browser environments. This creates poor Developer Experience (DX) for frontend consumers.
**Action:** Replace `Buffer` with `TextEncoder` and `Uint8Array` methods for string-to-bytes conversion to ensure browser compatibility without polyfills.

## 2024-05-22 - [Numeric Input Parsing]
**Learning:** `parseFloat` silently truncates input at the first non-numeric character (e.g., "1,000" becomes 1). In financial applications, this can lead to severe data loss and incorrect calculations without warning.
**Action:** Always strip non-numeric characters (like commas) and use strict regex validation (`/^-?(\d+(\.\d*)?|\.\d+)$/`) before parsing numbers to ensure data integrity.

## 2024-05-23 - [Currency Formatting UX]
**Learning:** Manual string construction for currency values (e.g. `${whole}.${fraction}`) fails for negative numbers (e.g. `-1.-500000`) and produces overly verbose output (e.g. `100.000000`). This confuses users and looks broken.
**Action:** Use `toLocaleString` for the integer part to add grouping (commas), handle negative signs explicitly, and trim unnecessary trailing zeros for cleaner, more human-readable display.

## 2024-05-24 - [Actionable Error Feedback]
**Learning:** Generic "Invalid format" errors force users to guess the validation rules (e.g., are commas allowed? can I use currency symbols?). This increases friction and support requests.
**Action:** Detect specific common invalid characters (commas, spaces, currency symbols) and throw precise error messages explaining exactly why the input was rejected and how to fix it.

## 2024-05-24 - [Flexible Decimal Formatting]
**Learning:** Hard-coded zero trimming in currency formatters (e.g. `10.50` -> `10.5`) causes visual misalignment in lists and tables. Developers often need fixed decimal places for alignment.
**Action:** Add options to formatting utilities (e.g., `{ minDecimals: 2 }`) to allow developers to enforce minimum decimal precision for consistent UI alignment while defaulting to trimming for compact display.

## 2024-05-25 - [Complete Currency Formatting]
**Learning:** Developers often manually concatenate currency symbols (e.g., `'$' + format(amount)`), which leads to incorrect negative formatting (e.g., `$-10.00` instead of `-$10.00`) and inconsistent UI.
**Action:** Utility functions should handle the full display logic, including prefix/suffix placement relative to the sign, to ensure typographically correct and localized output.

## 2024-05-26 - [Flexible String Truncation]
**Learning:** Hard-coded truncation (e.g. 6...4) limits developer flexibility, forcing them to reimplement truncation logic for different screen sizes (e.g. mobile vs desktop).
**Action:** Update utility functions like `formatAddress` to accept optional `start` and `end` parameters, allowing developers to customize the display while maintaining safe defaults.
