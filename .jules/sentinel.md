## 2024-05-22 - Missing Input Validation in Financial Utilities
**Vulnerability:** `calculateFeeSplit` allowed `guildFeeBps` > 10000 (100%), resulting in negative `performerAmount`. This could cause downstream contract calls to revert or unexpected UI states.
**Learning:** Utility functions in SDKs are often treated as "pure logic" without defensive checks, assuming callers validate inputs. However, SDKs must be robust against invalid usage.
**Prevention:** Enforce input validation (e.g., basis point ranges 0-1500) within utility functions to guarantee valid output states (e.g., non-negative amounts).

## 2025-02-13 - [Precision Loss in Financial Parsing]
**Vulnerability:** `parseUSDC` utilized `parseFloat` for converting strings to BigInt, leading to precision loss for large numbers (IEEE 754 limits) and accepting malformed inputs (e.g., "10abc").
**Learning:** JavaScript's `parseFloat` is inherently unsafe for financial or crypto amounts where precision is paramount and values can exceed `MAX_SAFE_INTEGER` when scaled.
**Prevention:** Use string-based parsing logic or established libraries (like `viem`'s `parseUnits`) for financial data conversion, with strict regex validation to reject scientific notation and invalid characters.
