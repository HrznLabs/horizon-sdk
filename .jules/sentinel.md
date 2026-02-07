## 2026-02-05 - Missing Input Validation in Fee Calculation
**Vulnerability:** The `calculateFeeSplit` function lacked validation for `guildFeeBps`, allowing callers to pass negative values or values exceeding the maximum allowed fee (15%). This could result in negative performer rewards or incorrect fee distribution.
**Learning:** Financial calculation utilities must always validate inputs against protocol constraints, even if they seem like internal helpers. The SDK should enforce the same invariants as the smart contracts where possible.
**Prevention:** Added explicit checks for `guildFeeBps < 0` and `guildFeeBps > FEES.MAX_GUILD_BPS` in `calculateFeeSplit`.
## 2024-05-22 - Missing Input Validation in Financial Utils
**Vulnerability:** Core financial calculation functions (e.g., `calculateFeeSplit`) lacked input validation, allowing negative fees or rewards to corrupt calculation results.
**Learning:** Utilities were treated as internal helpers assuming valid inputs, but are exported for public use in the SDK.
**Prevention:** Enforce strict input validation (non-negative, max caps) at the entry point of all exported financial functions.
