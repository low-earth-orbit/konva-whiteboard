# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project

Konva Whiteboard — a whiteboard web app built on the Konva canvas library. Static-exported Next.js app deployed to GitHub Pages. Front-end only (no backend yet).

## Tech stack

- **Framework:** Next.js 16 (App Router, `output: "export"` static export)
- **UI:** React 19 + Mantine UI v9 + Tailwind CSS v4
- **React Compiler:** enabled (`reactCompiler: true`) — do **not** add `useMemo`/`useCallback`/`React.memo` for performance; the compiler handles memoization
- **Canvas:** Konva.js + react-konva
- **State:** Redux Toolkit (slices in `src/redux/`)
- **Language:** TypeScript (strict, `noUnusedLocals`, `noUnusedParameters`)
- **Tests:** Vitest + React Testing Library (unit/component), Playwright (e2e, Chromium)
- **Lint/format:** ESLint flat config (`eslint.config.mjs`, `--max-warnings=0`) + Prettier

## Commands

| Command                | Description                               |
| ---------------------- | ----------------------------------------- |
| `npm run dev`          | Start dev server at http://localhost:3000 |
| `npm run build`        | Static export to `./out`                  |
| `npm run lint`         | ESLint (zero warnings)                    |
| `npm run typecheck`    | TypeScript check (`tsc --noEmit`)         |
| `npm run format`       | Prettier write                            |
| `npm run format:check` | Prettier check                            |
| `npm test`             | Vitest unit + component tests             |
| `npm run test:watch`   | Vitest in watch mode                      |
| `npm run test:e2e`     | Playwright e2e tests                      |

## Structure

- `src/app/` — App Router entry
  - `layout.tsx` — server component; `<html>`, fonts, metadata, `ColorSchemeScript`
  - `providers.tsx` — `"use client"`; wraps app in `MantineProvider` + Redux `Provider`
  - `page.tsx` — `"use client"`; loads `Canvas` via `next/dynamic({ ssr: false })` because the canvas slice reads `localStorage` at init
  - `globals.css` — Tailwind v4 + Mantine layered via CSS `@layer` to avoid preflight clashes
- `src/components/` — UI; canvas layers under `ink/`, `shapes/`, `text/`; toolbar under `toolbar/`
- `src/redux/` — Redux Toolkit store and slices

## Conventions

- **No manual memoization** — React Compiler is on. Don't add `useMemo`/`useCallback`/`React.memo` for performance.
- **`"use client"`** on any component using hooks, Redux, Konva, or browser APIs.
- **Browser APIs at module init** (e.g. `localStorage`) must be behind `ssr: false` dynamic imports — static export prerenders pages, so SSR-time access breaks the build or hydration.
- **Imports** use the `@/` alias mapped to `src/`.
- **Tests** live next to the code under test (`*.test.ts` / `*.test.tsx`); Vitest only picks up files under `src/`.

## Before opening a PR

Run, in order, and ensure all pass — this mirrors CI (`.github/workflows/ci.yml`):

```bash
npm run lint
npm run typecheck
npm run format:check
npm test
npm run build
npm run test:e2e
```

Also manually verify in the dev server: core drawing flow works, no console errors, no hydration warnings, and localStorage canvas state survives a reload.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution workflow.
