## 2024-05-22 - Missing Input Validation in Financial Utilities
**Vulnerability:** `calculateFeeSplit` allowed `guildFeeBps` > 10000 (100%), resulting in negative `performerAmount`. This could cause downstream contract calls to revert or unexpected UI states.
**Learning:** Utility functions in SDKs are often treated as "pure logic" without defensive checks, assuming callers validate inputs. However, SDKs must be robust against invalid usage.
**Prevention:** Enforce input validation (e.g., basis point ranges 0-1500) within utility functions to guarantee valid output states (e.g., non-negative amounts).

## 2024-05-23 - Strict Validation for Financial Strings
**Vulnerability:** `parseUSDC` relied on `parseFloat`, which silently truncates invalid input (e.g., "1,000" becomes 1). This could lead to users unknowingly sending incorrect amounts.
**Learning:** Standard JavaScript parsing functions like `parseFloat` are designed for leniency, not security. They are dangerous for financial applications where precision and intent are paramount.
**Prevention:** Always validate financial input strings against a strict format (regex) before parsing. Reject ambiguous characters like commas unless explicitly handled.

## 2026-02-13 - Precision Loss in Financial Parsing
**Vulnerability:** `parseUSDC` used `parseFloat` to convert large numeric strings, causing precision loss for inputs exceeding `2^53 - 1` (e.g., `9007199254740993` became `9007199254740992`). This allowed incorrect financial values to be processed silently.
**Learning:** `parseFloat` and `Number` in JavaScript are inherently unsafe for high-precision financial calculations. Even if the result is immediately cast to `BigInt`, the intermediate float step destroys information.
**Prevention:** Avoid `parseFloat` entirely for financial strings. Implement manual string parsing (split by decimal, pad fractional part) and construct `BigInt` directly from the sanitized string components.

## 2024-05-22 - toBytes32 Length Validation
**Vulnerability:** The `toBytes32` utility function accepted strings longer than 32 bytes and returned invalid hex strings (> 66 chars), which could lead to contract reverts or undefined behavior if passed as calldata.
**Learning:** Utility functions that prepare data for smart contracts must strictly enforce the constraints of the target Solidity types (e.g., `bytes32`) to fail fast on the client side.
**Prevention:** Always validate the length of inputs in utility functions that map to fixed-size Solidity types.
