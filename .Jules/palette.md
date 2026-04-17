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

## 2024-06-03 - [Smart Defaults for Link Generation]
**Learning:** Utilities that require explicit type parameters (e.g., `'tx'` vs `'address'`) for ambiguous inputs often lead to broken links or developer frustration when the input format is self-evident (e.g., 66-char tx hash vs 42-char address).
**Action:** Implement auto-detection logic based on clear patterns (like length or prefix) to provide "smart defaults," while still allowing manual overrides for edge cases.

## 2025-02-27 - [Safe String Truncation]
**Learning:** Using negative indices in `slice` (e.g., `str.slice(-n)`) is convenient for truncation, but fails silently when `n` is `0` (returns the full string instead of empty string). This leads to confusing UI bugs where "hidden" parts reappear.
**Action:** Always check if the end length is `0` before using `slice(-n)`, or use `str.slice(str.length - n)` to ensure consistent behavior.

## 2025-02-27 - [Consistent Duration Formatting]
**Learning:** Developers often reinvent duration formatting (e.g. `Math.floor(s/60) + 'm'`), leading to inconsistent displays across the app (e.g. '1h 5m' vs '65 mins').
**Action:** Centralize duration logic in a flexible utility that supports both short (1h 5m) and long (1 hour 5 minutes) formats to ensure consistent voice and tone.

## 2025-05-27 - [Large Number Readability]
**Learning:** Displaying raw large numbers (e.g. 1,500,000) in dashboards creates cognitive load and makes scanning difficult. Users prefer "1.5M" for quick comparison.
**Action:** Implement a `compact` option in number formatting utilities that automatically scales values by magnitude (K, M, B, T) and appends the appropriate suffix.

## 2025-05-28 - [Graceful Degradation in Time Displays]
**Learning:** Throwing hard errors for negative durations crashes UI components (like countdown timers) when they momentarily drift past zero before a state update. This causes a sudden, jarring error screen for a completely benign edge case.
**Action:** Utility functions formatting durations should handle negative inputs gracefully (e.g., by formatting their absolute value) rather than throwing, ensuring the UI remains stable during transient state changes.

## 2025-06-05 - [Consistent UI Alignment in Compact Formats]
**Learning:** Utilities that automatically abbreviate large numbers (e.g., K, M, B, T) often hardcode their decimal truncation logic, ignoring parameters like `minDecimals`. This causes visual misalignment in UI tables when developers need consistent string lengths (e.g., '1.00M' instead of '1M').
**Action:** Number formatting utilities that support `compact` modes must explicitly respect `minDecimals` by padding zeros (`padEnd`) to the fractional part before appending the unit suffix.

## 2025-06-10 - [Explicit Positive Change Display]
**Learning:** Frontend developers often manually prepend `+` signs to formatted numbers to indicate positive PnL or balance changes. This causes visual layout issues when a prefix (like `$`) is present because the manual `+` lands outside the prefix (e.g., `+$1.50` instead of `+$1.50`), looking broken.
**Action:** Add a `showPlusSign` configuration option to financial formatting utilities (`formatUSDC` and `formatBps`) to cleanly handle placing the explicit positive sign relative to any user-provided prefix.

## 2025-06-25 - [Accessible String Truncation]
**Learning:** Hard-coding three dots (`...`) for string truncation causes screen readers to read it literally as "dot dot dot," which is poor accessibility and takes up unnecessary horizontal space. The typographic ellipsis character (`…`) is a single character that is correctly interpreted by screen readers.
**Action:** When creating truncation utilities (like `formatAddress`), allow developers to configure the truncation separator so they can opt-in to the accessible, typographic ellipsis (`…`) while maintaining backward compatibility with standard defaults.
