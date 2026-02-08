## 2024-05-22 - Missing Input Validation in Financial Utilities
**Vulnerability:** `calculateFeeSplit` allowed `guildFeeBps` > 10000 (100%), resulting in negative `performerAmount`. This could cause downstream contract calls to revert or unexpected UI states.
**Learning:** Utility functions in SDKs are often treated as "pure logic" without defensive checks, assuming callers validate inputs. However, SDKs must be robust against invalid usage.
**Prevention:** Enforce input validation (e.g., basis point ranges 0-1500) within utility functions to guarantee valid output states (e.g., non-negative amounts).

## 2024-05-23 - Strict Bytes32 Validation
**Vulnerability:** `toBytes32` utility allowed inputs longer than 32 bytes, which could lead to silent data corruption or transaction failures when interacting with contracts expecting strictly 32 bytes.
**Learning:** Helper functions dealing with fixed-size EVM types (like `bytes32`) must strictly enforce length limits to prevent invalid data from propagating to the blockchain layer.
**Prevention:** Always validate input length against the target type's size (e.g., 32 bytes) and throw errors for oversized inputs instead of truncating or passing invalid data.
