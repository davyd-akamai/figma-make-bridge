# figma-make-bridge — maintainer notes

A React component library extracted from the Akamai internal ADS Figma library ("Internal-ADS-library"), built to be the **single source of truth for Figma Make prototypes**. What's currently published elsewhere isn't suitable for that purpose — this repo is the canonical source going forward.

Every component here is built dual-purpose from the start: usable as normal React app code today, and packaged so it installs directly into a Figma Make prototype. See [GUIDELINES.md](GUIDELINES.md) for the full reasoning and constraints behind that decision.

## Status

Published and in active use. The latest published version of `figma-make-bridge` is live on the public npm registry and has been connected to real Figma Make prototypes (see [GUIDELINES.md](GUIDELINES.md)'s "First real Make swap-in" section for what that's already surfaced). The public listing is a temporary/throwaway home — see "Figma Make packaging" below for the plan to move to Akamai's private registry.

This file is for people building the library (it does not ship in the package). Designers using the kit in Make: start at [designer-instructions.md](designer-instructions.md). The package-facing overview is [README.md](README.md).

## Stack

React 18.3 or 19 · Vite · Tailwind CSS v4 · TypeScript

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
components/*.figma.ts  Code Connect mappings, tying components back to their Figma nodes
templates/            Page-shell templates composing multiple components (DefaultCmPageTemplate)
tokens/               Design tokens: global primitives → semantic aliases → per-component
tokens/tokens-structure.md   Full explanation of the token architecture and validation rules
src/                  Vite app shell + the preview harness (App.tsx) + compiled token/typography CSS
docs/                 Public static preview site (plain HTML/CSS/JS, no build step) — one page per
                       component/template, published via GitHub Pages, see "Components" below
index.ts              Root barrel export — the package's public API surface
vite.lib.config.ts    Library-mode build config (npm run build) — separate from the dev-only vite.config.ts
scripts/generate-tokens.mjs   Build step (npm run tokens) that generates src/tokens.css from tokens/*.json
scripts/copy-guidelines.mjs   Build step that copies guidelines/ into dist/guidelines/
scripts/generate-guideline-tokens.mjs   Build step that adds a generated Tokens section to each component guideline in dist/guidelines/ only

GUIDELINES.md                 Living decision log — the source of truth for *why*, read this first
guidelines/                   The package-facing guidelines folder Figma Make's AI reads — ships as dist/guidelines/
designer-instructions.md      Plain-language, step-by-step guide for designers — share this with the design team
figma-make-kickoff-prompt.md      Copy-paste prompt: start a brand-new Figma Make prototype with the library installed
figma-make-test-guide.md          Checklist for verifying a fresh install actually works
figma-make-swap-in-prompt.md      Copy-paste prompt: convert an existing prototype's custom UI to use the library
figma-make-swap-in-guide.md       Reasoning/troubleshooting behind the swap-in prompt above
component-kickoff-prompt.md       Opening-message template for building a new component in a fresh session
page-template-kickoff-prompt.md   Opening-message template for composing components into a page-shell template
code-connect-kickoff-prompt.md    Opening-message template for continuing Code Connect mapping work
```

`core-design-system/` (Akamai's `@akamai/cds-components`) may also exist locally as reference material for porting new components — it's gitignored, not part of this repo, and never a runtime dependency. See `GUIDELINES.md`'s "core-design-system (CDS)" section.

## Components

**[Browse a live preview of every component ↗](https://davyd-akamai.github.io/figma-make-bridge/)** — a static HTML/CSS/JS site (`docs/`, no React, no build step) with one page per component and template, mirroring the real markup/tokens/interaction behavior of the source below. See "Component preview site" further down for how it's built and kept in sync.

| Component | What it is | Preview |
|---|---|---|
| [`GlobalHeader`](components/GlobalHeader.tsx) | Top app header — logo, search, notifications, account/sign-in, responsive across mobile/tablet/desktop | [↗](https://davyd-akamai.github.io/figma-make-bridge/components/global-header.html) |
| [`SideNavigation`](components/SideNavigation.tsx) | Collapsible left nav rail — sections with pages, hover-to-expand/pin-to-lock interaction, badges | [↗](https://davyd-akamai.github.io/figma-make-bridge/components/side-navigation.html) |
| [`GlobalFooter`](components/GlobalFooter.tsx) | App footer — links, copyright, responsive stacked/row layout | [↗](https://davyd-akamai.github.io/figma-make-bridge/components/global-footer.html) |
| [`DefaultCmPageTemplate`](templates/DefaultCmPageTemplate.tsx) | Page shell composing GlobalHeader + SideNavigation + GlobalFooter with a content slot | [↗](https://davyd-akamai.github.io/figma-make-bridge/templates/default-cm-page-template.html) |
| [`Badge`](components/Badge.tsx) | General-purpose status/label badge — subtle/accent types across 7 colors, optional leading icon (matches Figma's `Badge`, node 76:4205) | [↗](https://davyd-akamai.github.io/figma-make-bridge/components/badge.html) |
| [`SystemBadge`](components/SystemBadge.tsx) | Fixed NEW/BETA label badge (matches Figma's `cm_global-badge` exactly — not a generic customizable badge; renamed from `Badge` once the general-purpose one took over that name) | [↗](https://davyd-akamai.github.io/figma-make-bridge/components/system-badge.html) |
| [`Button`](components/Button.tsx) | Primary/secondary/link/danger variants, loading state, start/end icons | [↗](https://davyd-akamai.github.io/figma-make-bridge/components/button.html) |
| [`Container`](components/Container.tsx) | Generic bordered content surface for grouping page content | [↗](https://davyd-akamai.github.io/figma-make-bridge/components/container.html) |
| [`TextField`](components/TextField.tsx) | Text input with label, helper/error text, clear button, info icon | [↗](https://davyd-akamai.github.io/figma-make-bridge/components/text-field.html) |
| [`Checkbox`](components/Checkbox.tsx) | Checkbox with indeterminate state, small/large sizes | [↗](https://davyd-akamai.github.io/figma-make-bridge/components/checkbox.html) |
| [`RadioButton`](components/RadioButton.tsx) | Radio input, small/large sizes — grouping is via native `name`, not a wrapper component | [↗](https://davyd-akamai.github.io/figma-make-bridge/components/radio-button.html) |
| [`Select`](components/Select.tsx) | Single-select dropdown with type-to-filter, optional per-option icon, Create/empty-state rows | [↗](https://davyd-akamai.github.io/figma-make-bridge/components/select.html) |
| [`Search`](components/Search.tsx) | Search input with leading icon and optional suggestions dropdown | [↗](https://davyd-akamai.github.io/figma-make-bridge/components/search.html) |
| [`TabsHorizontal`](components/TabsHorizontal.tsx) | Tab headers with automatic overflow menu, small/large sizes | [↗](https://davyd-akamai.github.io/figma-make-bridge/components/tabs-horizontal.html) |
| [`Drawer`](components/Drawer.tsx) | Right-hand slide-in panel with overlay, sticky footer slot, small/default/flexible sizes | [↗](https://davyd-akamai.github.io/figma-make-bridge/components/drawer.html) |
| [`Table`](components/Table.tsx) | Data table — sortable, selectable, expandable rows, typed cell types, row actions | [↗](https://davyd-akamai.github.io/figma-make-bridge/components/table.html) |
| [`components/icons`](components/icons/index.tsx) | Every icon used across components, one component per icon | [↗](https://davyd-akamai.github.io/figma-make-bridge/components/icons.html) |

Check [GUIDELINES.md](GUIDELINES.md)'s "Content-tier components" section for what's currently planned next (Topbar, Notification banner/toast).

### Component preview site

`docs/` is a standalone static site — plain HTML/CSS/JS, no React and no build step — with one page per component and one per template, kept in a directory structure that mirrors the source split (`docs/components/`, `docs/templates/`). Each page reuses the library's own compiled stylesheet (`docs/assets/styles.css`, copied from `npm run build`'s `dist/styles.css`) and hand-mirrors the exact class names/CSS custom properties the real component renders, so colors/spacing/typography come from the same tokens, not a re-guessed approximation. [.github/workflows/sync-docs-styles.yml](.github/workflows/sync-docs-styles.yml) keeps that copy in sync automatically — it rebuilds and re-commits `docs/assets/styles.css` on every push to `main` that touches component/token/style source, so it never needs a manual step. Interactive components (Button, Checkbox, SideNavigation, TextField, ...) ship a small vanilla-JS reimplementation of their real interaction logic (hover-expand/pin, indeterminate toggling, controlled clear buttons, etc.) rather than static screenshots. Shared site chrome (nav sidebar, page layout) lives in `docs/assets/site.css`/`docs/assets/shell.js`, kept separate from the library's own styles so nothing here leaks into the actual component output.

Publish via GitHub Pages: **Settings → Pages → Source: Deploy from a branch → Branch: `main`, folder: `/docs`**. Preview locally with any static file server, e.g. `npx serve docs`.

## Design tokens

Three-tier system — `global.json` (raw primitives) → `light.json`/`dark.json` (semantic aliases, theme-specific) → per-component token files (`header.json`, `sideNavigation.json`, `badge.json`, `systemBadge.json`, `button.json`, `textField.json`, `checkbox.json`, `radioButton.json`, `container.json`, etc.). Use `alias.*` for anything that must flip in dark mode. Use `global.*` only for parts that stay the same in both modes (global header, selected side-nav item). `component.*` variables in `src/tokens.css` are light-only literals and do not flip. Full details in [tokens/tokens-structure.md](tokens/tokens-structure.md).

## Extending this library

Read [GUIDELINES.md](GUIDELINES.md) before building anything new — it has the established conventions (exact-vector icons only, reuse the shared icon pack before building something new, extend token files additively, data-driven component APIs, check `core-design-system`'s Lit source as a behavior reference before porting a new component) and a log of past mistakes worth not repeating.

Starting a new component or page template in a fresh session with no chat history? Copy the relevant template as your opening message:
- [component-kickoff-prompt.md](component-kickoff-prompt.md) — a single new component
- [page-template-kickoff-prompt.md](page-template-kickoff-prompt.md) — composing existing components into a layout shell
- [code-connect-kickoff-prompt.md](code-connect-kickoff-prompt.md) — continuing Code Connect mapping work

## Using this in Figma Make

If you're building or converting a prototype rather than working on the library itself, [designer-instructions.md](designer-instructions.md) is the guide to use — it covers both starting a new prototype and converting an existing one, and links out to the specific copy-paste prompts needed for each.

## Figma Make packaging

Published to the public npm registry as a temporary home (`figma-make-bridge`, latest published version) to prove the install-in-a-real-prototype flow works end to end — see [GUIDELINES.md](GUIDELINES.md)'s "Packaging" section for the full build setup. Moving to Akamai's private registry still requires an org admin to confirm it's enabled and create a scope; see GUIDELINES.md's "Figma Make private registry" section for that checklist. Every publish also ships [guidelines/](guidelines) as `dist/guidelines/`, the folder Make's AI reads for how to use the library correctly. The kit flow for designers is in [designer-instructions.md](designer-instructions.md).
