## 2024-10-25 - SDK Helper Input Validation
**Vulnerability:** `calculateFeeSplit` accepted invalid fee percentages, leading to negative result values.
**Learning:** SDK utility functions are often used in frontend UIs to display data. If they don't validate inputs, they can cause UI crashes or misleading financial data display, even if the smart contract ultimately rejects the transaction.
**Prevention:** Validate all numerical inputs in SDK helpers, especially those representing financial percentages or amounts, mirroring smart contract constraints.
