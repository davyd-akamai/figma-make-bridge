# figma-make-bridge

A React component library extracted from the Akamai internal ADS Figma library ("Internal-ADS-library"), built to be the **single source of truth for Figma Make prototypes**. What's currently published elsewhere isn't suitable for that purpose — this repo is the canonical source going forward.

Every component here is built dual-purpose from the start: usable as normal React app code today, and designed so it can later be published to Figma Make's private npm registry without rework. See [GUIDELINES.md](GUIDELINES.md) for the full reasoning and constraints behind that decision.

## Status

Early stage. Components are built and previewed locally; publishing to Figma Make (private npm registry) hasn't been set up yet — see the "Figma Make packaging" section below.

## Stack

React 18 · Vite · Tailwind CSS v4 · TypeScript

## Getting started

```bash
npm install
npm run dev
```

Opens a local preview harness (`src/App.tsx`) showing every component and its states — this is a dev-only scaffold, not part of the published package.

**Known environment gotcha:** if `npm run dev` fails with a `@rollup/rollup-*` native-binding error, it's a known npm optional-dependency bug, not a code issue. Fix:

```bash
rm -rf node_modules package-lock.json && npm install
```

## Repo structure

```
components/          React components (one file per component)
components/icons/     Shared icon pack — every icon used by any component, pulled as exact
                       vectors from Figma, never hand-approximated
tokens/               Design tokens: global primitives → semantic aliases → per-component
tokens/tokens-structure.md   Full explanation of the token architecture and validation rules
src/                  Vite app shell + the preview harness (App.tsx) + compiled token/typography CSS
GUIDELINES.md         Living decision log — the source of truth for *why*, read this first
figma-make-guidelines.md    Draft of the package-facing Guidelines.md Figma Make's AI will read
                            once this is published (placeholder filename until then)
component-kickoff-prompt.md       Opening-message template for building a new component in a fresh session
page-template-kickoff-prompt.md  Opening-message template for composing components into a page-shell template
```

## Components

| Component | What it is |
|---|---|
| [`GlobalHeader`](components/GlobalHeader.tsx) | Top app header — logo, search, notifications, account/sign-in, responsive across mobile/tablet/desktop |
| [`SideNavigation`](components/SideNavigation.tsx) | Collapsible left nav rail — sections with pages, hover-to-expand/pin-to-lock interaction, badges |
| [`Badge`](components/Badge.tsx) | Fixed NEW/BETA label badge (matches Figma's `cm_global-badge` exactly — not a generic customizable badge) |
| [`components/icons`](components/icons/index.tsx) | Every icon used across components, one component per icon |

Check [GUIDELINES.md](GUIDELINES.md)'s roadmap section for what's currently in progress (GlobalFooter is next).

## Design tokens

Three-tier system — `global.json` (raw primitives) → `light.json`/`dark.json` (semantic aliases, theme-specific) → per-component token files (`header.json`, `sideNavigation.json`, `badge.json`, etc.). Components should only ever reference `component.*` or `alias.*` tokens, never `global.*` directly. Full details in [tokens/tokens-structure.md](tokens/tokens-structure.md).

## Extending this library

Read [GUIDELINES.md](GUIDELINES.md) before building anything new — it has the established conventions (exact-vector icons only, reuse the shared icon pack and `Badge` before building something new, extend token files additively, data-driven component APIs) and a log of past mistakes worth not repeating.

Starting a new component or page template in a fresh session with no chat history? Copy the relevant template as your opening message:
- [component-kickoff-prompt.md](component-kickoff-prompt.md) — a single new component
- [page-template-kickoff-prompt.md](page-template-kickoff-prompt.md) — composing existing components into a layout shell

## Figma Make packaging

Not set up yet. Publishing will require an Akamai Figma org admin to confirm the private npm registry is enabled and create a scope — see [GUIDELINES.md](GUIDELINES.md)'s "Figma Make private registry" section for the full checklist. [figma-make-guidelines.md](figma-make-guidelines.md) is a head start on the `Guidelines.md` file Figma Make's AI will read once this package is published.
