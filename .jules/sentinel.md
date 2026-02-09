## 2024-05-22 - Missing Input Validation in Financial Utilities
**Vulnerability:** `calculateFeeSplit` allowed `guildFeeBps` > 10000 (100%), resulting in negative `performerAmount`. This could cause downstream contract calls to revert or unexpected UI states.
**Learning:** Utility functions in SDKs are often treated as "pure logic" without defensive checks, assuming callers validate inputs. However, SDKs must be robust against invalid usage.
**Prevention:** Enforce input validation (e.g., basis point ranges 0-1500) within utility functions to guarantee valid output states (e.g., non-negative amounts).

## 2026-02-09 - Float Precision in Financial Parsing
**Vulnerability:** `parseUSDC` used `parseFloat` to convert strings to numbers before scaling to `BigInt`. This caused precision loss for large integers (beyond `Number.MAX_SAFE_INTEGER`) and silent acceptance of malformed inputs (e.g., "10abc").
**Learning:** Even when converting to `BigInt` eventually, intermediate use of `number` or `parseFloat` compromises integrity. JavaScript `number` type is insufficient for precise financial calculations.
**Prevention:** Implement strict string-based parsing for financial amounts. Avoid `parseFloat` entirely. Use regex validation to reject ambiguous formats.
