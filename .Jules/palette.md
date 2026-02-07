## 2024-05-23 - Developer Experience is User Experience
**Learning:** For SDKs without a UI, "User Experience" translates to "Developer Experience". Ensuring browser compatibility (isomorphism) prevents frustrating "Buffer is not defined" errors, which is a critical UX improvement for developers.
**Action:** When working on SDKs, prioritize isomorphic utilities (e.g., `TextEncoder` over `Buffer`) to ensure smooth usage in all environments (Node, Browser, Edge).

## 2026-02-05 - SDK UX is DX
**Learning:** For SDKs without UI components, "UX improvements" translate to Developer Experience (DX) enhancements, such as utility functions for formatting data (e.g. `formatDuration`), rather than logic validation or visual changes.
**Action:** Focus on "helper" utilities that make the developer's life easier when building UIs using the SDK.
