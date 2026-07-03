# AGENTS.md — horizon-sdk

Context for autonomous agents (Jules, etc.). Read this before planning.

## Stack & package manager
- TypeScript library bundled with **tsup**. Published to npm as **`horizon-protocol-sdk`**.
- Its dependencies become every consumer's dependencies → **bundle size & supply-chain hygiene are the priorities.**
- Package manager: **yarn** (Yarn 1 classic). NEVER use npm or pnpm.

## Commands
- Lint: `yarn lint` · Types: `yarn type-check` · Build: `yarn build` · Clean: `yarn clean`
- **There is NO `test` script** — do not run `yarn test` (it will fail). Verify via `yarn lint` + `yarn type-check` + `yarn build`.

## Infra / deploy
- Published to **npm** (currently manual; no CI publish step). Network context: Base Sepolia.

## Git & PR rules (MANDATORY)
- **Branch FROM `staging`. Open PRs against `staging`. NEVER push to `main` or `staging` directly.**
- pre-commit runs `secretlint` — never bypass.
- Conventional commits; no `Co-Authored-By` lines. One focused change per PR.

## Agent scope
- **No UI → the UX/accessibility agent (Palette) does NOT apply here.** Only Bolt and Sentinel run.
- Bolt = bundle size & tree-shaking (avoid heavy imports, barrel-file bloat, side-effectful top-level code; never change public API signatures).
- Sentinel = supply chain (vulnerable/outdated deps, unvalidated inputs in exported fns, prototype pollution, ReDoS regexes, unsafe eval). Public-API/crypto changes are advisory-only.
- Agent journals: `.jules/<agent>.md` (lowercase).
