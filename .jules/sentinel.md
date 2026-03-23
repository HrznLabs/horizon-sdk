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

## 2024-05-24 - Unvalidated URL Generation
**Vulnerability:** `getBaseScanUrl` blindly concatenated user input into a URL, allowing generation of malicious links (XSS, Open Redirect) if the output was used in a web context without further validation.
**Learning:** Helper functions that generate external links (e.g., block explorers) are often trusted by developers as "safe", but if they accept arbitrary input, they become a vector for injection attacks.
**Prevention:** Strictly validate inputs (e.g., regex for hex address/tx hash) before constructing URLs. Fail securely by throwing an error instead of returning a malformed URL.

## 2026-02-19 - Implicit BigInt Conversion Risks
**Vulnerability:** `calculateFeeSplit` allowed non-integer numeric inputs for `guildFeeBps` which caused unhandled `RangeError` exceptions (and stack trace exposure) when internally converted to `BigInt`.
**Learning:** The `BigInt()` constructor throws a `RangeError` for non-integer inputs, which can crash applications or expose internal implementation details if not caught. Financial utilities must strictly validate integer inputs before attempting BigInt conversion.
**Prevention:** Explicitly check `Number.isInteger()` for all numeric inputs intended for `BigInt` conversion.

## 2026-03-03 - Unvalidated Non-Finite Numbers in Float Utilities
**Vulnerability:** `formatBps` accepted `NaN`, `Infinity`, and `-Infinity` for the `bps` float input, resulting in malformed strings like `"NaN%"` or `"Infinity%"`.
**Learning:** Utility functions accepting JavaScript floating point `number` types do not natively enforce finiteness. Failure to explicitly check for `NaN` or `Infinity` allows bad numerical state from upstream operations to leak directly into the user interface or downstream functions as silent data corruption.
**Prevention:** Use `Number.isFinite()` as the first validation check for any numeric input where standard floating point rules apply and non-finite results indicate an invalid state or operation.

## 2026-03-09 - Unvalidated Type Parameter in URL Generation
**Vulnerability:** `getBaseScanUrl` accepted any value for the `type` parameter (e.g., bypassing type constraints via `as any`), allowing path traversal and XSS via `type` (e.g., `"address/../../evil"`).
**Learning:** Even if a parameter's type is strictly defined in TypeScript (e.g., `'address' | 'tx'`), malicious input can be passed during runtime. You cannot rely on TS types alone for input validation, especially for functions generating external URLs.
**Prevention:** Always validate all parameters that are incorporated into a URL, not just the "main" input. Ensure the `type` parameter strictly matches allowed values (`'address'` or `'tx'`) and throw a generic error if it does not.

## 2026-03-10 - Reflected User Input in Utility Errors
**Vulnerability:** `calculateExpiresAt` interpolated the potentially unvalidated `durationSeconds` input parameter directly into the error message if the value was not an integer. This could allow Log Injection or Reflected XSS if an attacker supplied a string containing malicious payload (e.g., `<script>alert(1)</script>`) to an untyped API endpoint that utilizes the utility without upstream parsing.
**Learning:** Utility functions that throw exceptions for invalid inputs must never dynamically reflect the unvalidated input string within the error message. Even if the type signature is `number`, external inputs in JavaScript runtimes may bypass this.
**Prevention:** Use static, safe error messages exclusively for input validation errors (e.g., "Duration must be an integer").
