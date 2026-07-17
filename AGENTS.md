# PRISMAFLOW Studio

## Cursor Cloud specific instructions

PRISMAFLOW Studio is a **frontend-only** React + Vite PWA (accessible colouring app).
There is no backend and no account/login — all artwork is persisted in the browser's
`localStorage`, so no secrets or external services are required to run or test it.

### Services / commands
This repo is a single client app. Standard scripts live in `package.json`:

- Dev server: `pnpm run dev` → http://localhost:5173 (uses `vite.config.ts`).
- Build: `pnpm run build` (runs `tsc` then `vite build`, output in `dist/`).
- Preview production build: `pnpm run preview` → http://localhost:4173.
- E2E + a11y tests: `pnpm run test:e2e` (Playwright). The Playwright `webServer`
  auto-starts `pnpm run preview`, which serves `dist/`, so run `pnpm run build`
  first if `dist/` is stale. `pnpm run test:a11y` runs only the accessibility spec.
- Lint: `pnpm run lint`.

### Non-obvious gotchas
- **`pnpm run dev` uses `vite.config.ts`, NOT `vite.config.dev.ts`.** The latter
  pulls in `miaoda-sc-plugin` and external CDN scripts and is not used by the `dev`
  script; don't switch the dev command to it in this environment.
- **`pnpm run lint` requires the `ast-grep` CLI on `PATH`** (used by `.rules/check.sh`).
  It is installed at `~/.npm-global/bin` and added to `PATH` via `~/.bashrc`. The lint
  script chains its tools with `;`, so its final exit code comes from the `vite build`
  step — individual `tsgo`/`ast-grep` findings do NOT fail the command.
- **Lint surfaces several pre-existing code-quality findings** (e.g. `tsgo` strict
  errors in `src/features/...`, an `ast-grep` `require-button-interaction` warning).
  These are existing repo code issues, not environment problems.
- `pnpm run typecheck` runs `tsc -p tsconfig.json` whose `files` is empty with project
  references, so it passes trivially; the stricter check is `tsgo -p tsconfig.check.json`
  inside `pnpm run lint`.
