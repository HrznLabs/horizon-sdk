## 2024-05-22 - Missing Input Validation in Financial Utilities
**Vulnerability:** `calculateFeeSplit` allowed `guildFeeBps` > 10000 (100%), resulting in negative `performerAmount`. This could cause downstream contract calls to revert or unexpected UI states.
**Learning:** Utility functions in SDKs are often treated as "pure logic" without defensive checks, assuming callers validate inputs. However, SDKs must be robust against invalid usage.
**Prevention:** Enforce input validation (e.g., basis point ranges 0-1500) within utility functions to guarantee valid output states (e.g., non-negative amounts).

## 2024-05-23 - Strict Validation for Financial Strings
**Vulnerability:** `parseUSDC` relied on `parseFloat`, which silently truncates invalid input (e.g., "1,000" becomes 1). This could lead to users unknowingly sending incorrect amounts.
**Learning:** Standard JavaScript parsing functions like `parseFloat` are designed for leniency, not security. They are dangerous for financial applications where precision and intent are paramount.
**Prevention:** Always validate financial input strings against a strict format (regex) before parsing. Reject ambiguous characters like commas unless explicitly handled.

## 2024-05-22 - [Double Precision in Financial SDKs]
**Vulnerability:** Precision loss in `parseUSDC` when parsing large numeric strings or high-precision values due to implicit usage of `parseFloat`.
**Learning:** Even if a function accepts `string`, converting it to `number` (float) before `BigInt` destroys precision for values > `MAX_SAFE_INTEGER` (approx 9e15) or high-decimal fractions, causing silent data corruption in financial operations.
**Prevention:** For financial SDKs, ALWAYS parse string inputs manually (split integer/fraction, pad, concatenate) into `BigInt`. Never use `parseFloat` or `Number()` for amounts that might exceed 53 bits of precision.
