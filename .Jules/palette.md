## 2024-05-23 - Developer Experience is User Experience
**Learning:** For SDKs without a UI, "User Experience" translates to "Developer Experience". Ensuring browser compatibility (isomorphism) prevents frustrating "Buffer is not defined" errors, which is a critical UX improvement for developers.
**Action:** When working on SDKs, prioritize isomorphic utilities (e.g., `TextEncoder` over `Buffer`) to ensure smooth usage in all environments (Node, Browser, Edge).
