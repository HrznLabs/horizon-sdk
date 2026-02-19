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

## 2026-02-14 - Time-Based Input Validation
**Vulnerability:** `calculateExpiresAt` accepted any `number` for `durationSeconds`, allowing creation of invalid timestamps (e.g., past dates, extremely far future, or `Infinity`), which could lead to failed transactions or locked funds.
**Learning:** Utility functions dealing with time often assume "sensible" inputs but fail to enforce protocol constraints (like min/max duration) at the earliest possible point.
**Prevention:** Always validate time-based inputs against protocol constants (e.g., `MIN_DURATION`, `MAX_DURATION`) in utility functions to catch errors before they reach the blockchain.

## 2026-02-18 - Unbounded String Processing in Financial Parsing
**Vulnerability:** `parseUSDC` iterated over the entire input string without length validation, allowing a malicious actor to cause Denial of Service (DoS) by supplying an excessively long string (e.g., 100MB) which would block the event loop.
**Learning:** Utility functions exposed to user input (e.g., via API or UI) must implement resource limits (like maximum string length) to prevent resource exhaustion attacks, even if the parsing logic itself is robust.
**Prevention:** Enforce strict length limits on string inputs in parsing functions before processing (implemented 32-char limit in `parseUSDC`).

## 2026-02-19 - Inconsistent Financial Validation
**Vulnerability:** `calculateDDR` and `calculateLPP` accepted negative `rewardAmount` inputs, returning negative values, while `calculateFeeSplit` correctly enforced non-negative inputs.
**Learning:** Security validation must be applied consistently across all related utility functions, not just the "primary" one. Copy-paste errors or oversight often leave secondary functions vulnerable.
**Prevention:** Audit all related financial functions for consistent input validation when modifying or reviewing one function.
