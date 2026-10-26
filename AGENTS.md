# Wanderlust

Next.js 16.4.3 app (App Router, `src/`), React 19, npm. Bootstrapped from create-next-app; UI is shadcn on Base UI.

## Commands

- `npm run dev` / `npm run build` — Turbopack-based.
- `npm run lint` — flat ESLint 9 config (`eslint.config.mjs`). There is **no test script**.
- Typecheck: `npx tsc --noEmit` (no dedicated script; `tsconfig` includes `.next/types/**`, so run `next build` first if type errors seem missing).

## Framework quirks (differ from defaults / older Next)

- `next.config.ts` enables `reactCompiler: true` and `cacheComponents: true`. Do not hand-write `useMemo`/`memo`/`useCallback` for optimization (React Compiler handles it); follow Rules of React strictly and use `use cache`/Suspense patterns for async data — read the matching guide in `node_modules/next/dist/docs/` when touching these.
- Tailwind **v4**, CSS-first: all theme tokens/vars live in `src/app/globals.css` (`@theme inline`). There is no `tailwind.config.js`.
- Tailwind is applied through a custom Turbopack rule (`@tailwindcss/turbopack`) in `next.config.ts` — don't remove it or CSS breaks.

## shadcn / Base UI

- `components.json` uses style `base-nova` backed by **`@base-ui/react`**, NOT the classic Radix-based shadcn. Read an existing component in `src/components/ui/` before assuming Radix imports or export shapes.
- Add components with `npx shadcn add <name>`; they land in `src/components/ui/`.

## Conventions

- Path alias: `@/*` → `src/*`.
- Fonts: Josefin Sans via `next/font/google`, set on `<html>` in `src/app/layout.tsx` and wired into Tailwind theme vars in `globals.css`.
- Dark mode is a `.dark` class variant (`@custom-variant dark`).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
