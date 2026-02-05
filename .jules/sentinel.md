## 2024-05-22 - Missing Input Validation in Financial Utils
**Vulnerability:** Core financial calculation functions (e.g., `calculateFeeSplit`) lacked input validation, allowing negative fees or rewards to corrupt calculation results.
**Learning:** Utilities were treated as internal helpers assuming valid inputs, but are exported for public use in the SDK.
**Prevention:** Enforce strict input validation (non-negative, max caps) at the entry point of all exported financial functions.
