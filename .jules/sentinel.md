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

## 2026-03-10 - Missing Runtime Type Checks in Utility Functions
**Vulnerability:** Several utility functions (`parseUSDC`, `formatUSDC`, `toBytes32`, `getBaseScanUrl`) expected `string` or `bigint` types but lacked explicit runtime type checking. When passed invalid types (like `null` or an object) from untyped external callers, they threw unhandled `TypeError` exceptions (e.g., "Cannot read properties of null (reading 'length')").
**Learning:** TypeScript type annotations do not exist at runtime. If an SDK utility function is consumed by plain JavaScript or `any`-typed contexts, passing unexpected types can cause unhandled crashes rather than secure validation errors.
**Prevention:** Always implement explicit runtime type checking (e.g., `typeof input !== 'string'`) as the very first validation step in utility functions, throwing static error messages to fail gracefully.

## 2024-05-20 - Enforcing BigInt Type Checks on SDK Utilities
**Vulnerability:** Core financial calculation functions like `calculateDDR`, `calculateLPP`, `calculateFeeSplit`, and `isMissionExpired` assumed all input arguments implicitly provided to them would be `bigint` types. However, when these functions are used in loosely-typed environments (e.g. JavaScript consumers, loosely typed frontend calls) passing string types such as `"100"` led to implicit conversion attempts that would throw a cryptic "TypeError: Cannot mix BigInt and other types". This could crash consuming applications and obscure validation errors, which is a DoS vector.
**Learning:** Even internal helper methods should enforce strict runtime typing on their inputs to prevent unchecked execution context mixing if the inputs originate from untyped external sources. Standard TypeScript type checking does not cover these runtime execution environments.
**Prevention:** Added explicit `typeof arg !== 'bigint'` validation checks throwing clear, statically defined `Error` messages to the start of all core arithmetic operations in `src/utils/index.ts`.

## 2026-04-17 - Unbounded String Parsing in toBytes32 Error Path
**Vulnerability:** The `toBytes32` function contained an error path for oversized strings that used `TEXT_ENCODER.encode(str).length` to generate a precise error message. If an attacker provided an extremely long string (e.g., 500MB), this unbounded encoding operation would allocate massive amounts of memory, blocking the Node.js event loop for seconds (or running out of memory), causing a Denial of Service (DoS).
**Learning:** Error paths can themselves be vectors for DoS if they perform unbounded operations (like memory-heavy allocations) to generate descriptive error messages. Security limits must be applied *before* any unbounded operation, not during error message construction.
**Prevention:** Implement a hard limit on input string lengths (e.g., `if (str.length > 256)`) at the very start of utility functions that handle unbounded memory operations to prevent exhaustion attacks.

## 2026-05-18 - Silent Precision Loss in Timestamp Validation
**Vulnerability:** The `isMissionExpired` function cast the `expiresAt` parameter (a `bigint`) to a `Number` to perform time comparisons. This casting of `BigInt` to `Number` could lead to silent precision loss for exceedingly large timestamps, potentially causing incorrect expiration evaluations.
**Learning:** Never cast `BigInt` variables to `Number` in validation functions, especially for timestamps or financial calculations, as this introduces risks of silent precision loss.
**Prevention:** Use strict, native `BigInt` math operations for time comparisons and validations involving `bigint` inputs.

## 2026-06-25 - Unvalidated Bound Checks for Numbers
**Vulnerability:** The `parseUSDC` function natively supported both `string` and `number` types. For `number` inputs, it implicitly converted the value to a string via `.toString()`. However, if the provided `number` exceeded `Number.MAX_SAFE_INTEGER` (or was less than `Number.MIN_SAFE_INTEGER`), JavaScript inherently applies silent precision loss. This could result in incorrect or approximate financial values being processed without warning or errors to the caller.
**Learning:** Overloading inputs to accept `number` for financial conversions is convenient, but risky. JavaScript's double-precision floating-point format silently mutates bounds-exceeding numbers before they even reach utility function boundaries.
**Prevention:** Strictly enforce `Number.MAX_SAFE_INTEGER` and `Number.MIN_SAFE_INTEGER` boundaries whenever `typeof input === 'number'` is accepted for a financial utility, explicitly instructing developers to cast to string on their end to guarantee precision.
