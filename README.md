# figma-make-bridge

A React component library extracted from the Akamai internal ADS Figma library ("Internal-ADS-library"), built to be the **single source of truth for Figma Make prototypes**. What's currently published elsewhere isn't suitable for that purpose — this repo is the canonical source going forward.

Every component here is built dual-purpose from the start: usable as normal React app code today, and packaged so it installs directly into a Figma Make prototype. See [GUIDELINES.md](GUIDELINES.md) for the full reasoning and constraints behind that decision.

## Status

Published and in active use. `figma-make-bridge@0.1.8` is live on the public npm registry and has been connected to real Figma Make prototypes (see [GUIDELINES.md](GUIDELINES.md)'s "First real Make swap-in" section for what that's already surfaced). The public listing is a temporary/throwaway home — see "Figma Make packaging" below for the plan to move to Akamai's private registry.

If you're a designer looking to *use* this library in a prototype rather than build it, start at [designer-instructions.md](designer-instructions.md) instead of this file.

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
components/*.figma.ts  Code Connect mappings, tying components back to their Figma nodes
templates/            Page-shell templates composing multiple components (DefaultCmPageTemplate)
tokens/               Design tokens: global primitives → semantic aliases → per-component
tokens/tokens-structure.md   Full explanation of the token architecture and validation rules
src/                  Vite app shell + the preview harness (App.tsx) + compiled token/typography CSS
docs/                 Public static preview site (plain HTML/CSS/JS, no build step) — one page per
                       component/template, published via GitHub Pages, see "Components" below
index.ts              Root barrel export — the package's public API surface
vite.lib.config.ts    Library-mode build config (npm run build) — separate from the dev-only vite.config.ts
scripts/copy-guidelines.mjs   Build step that copies figma-make-guidelines.md into dist/Guidelines.md

GUIDELINES.md                 Living decision log — the source of truth for *why*, read this first
figma-make-guidelines.md      The package-facing Guidelines.md Figma Make's AI reads — ships inside dist/
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
| [`Badge`](components/Badge.tsx) | Fixed NEW/BETA label badge (matches Figma's `cm_global-badge` exactly — not a generic customizable badge) | [↗](https://davyd-akamai.github.io/figma-make-bridge/components/badge.html) |
| [`Button`](components/Button.tsx) | Primary/secondary/link/danger variants, loading state, start/end icons | [↗](https://davyd-akamai.github.io/figma-make-bridge/components/button.html) |
| [`Container`](components/Container.tsx) | Generic bordered content surface for grouping page content | [↗](https://davyd-akamai.github.io/figma-make-bridge/components/container.html) |
| [`TextField`](components/TextField.tsx) | Text input with label, helper/error text, clear button, info icon | [↗](https://davyd-akamai.github.io/figma-make-bridge/components/text-field.html) |
| [`Checkbox`](components/Checkbox.tsx) | Checkbox with indeterminate state, small/large sizes | [↗](https://davyd-akamai.github.io/figma-make-bridge/components/checkbox.html) |
| [`RadioButton`](components/RadioButton.tsx) | Radio input, small/large sizes — grouping is via native `name`, not a wrapper component | [↗](https://davyd-akamai.github.io/figma-make-bridge/components/radio-button.html) |
| [`components/icons`](components/icons/index.tsx) | Every icon used across components, one component per icon | [↗](https://davyd-akamai.github.io/figma-make-bridge/components/icons.html) |

Check [GUIDELINES.md](GUIDELINES.md)'s "Content-tier components" section for what's currently planned next (Table, Topbar, Select, Drawer, Notification banner/toast, Tabs).

### Component preview site

`docs/` is a standalone static site — plain HTML/CSS/JS, no React and no build step — with one page per component and one per template, kept in a directory structure that mirrors the source split (`docs/components/`, `docs/templates/`). Each page reuses the library's own compiled stylesheet (`docs/assets/styles.css`, copied from `npm run build`'s `dist/styles.css` — regenerate it after any component change) and hand-mirrors the exact class names/CSS custom properties the real component renders, so colors/spacing/typography come from the same tokens, not a re-guessed approximation. Interactive components (Button, Checkbox, SideNavigation, TextField, ...) ship a small vanilla-JS reimplementation of their real interaction logic (hover-expand/pin, indeterminate toggling, controlled clear buttons, etc.) rather than static screenshots. Shared site chrome (nav sidebar, page layout) lives in `docs/assets/site.css`/`docs/assets/shell.js`, kept separate from the library's own styles so nothing here leaks into the actual component output.

Publish via GitHub Pages: **Settings → Pages → Source: Deploy from a branch → Branch: `main`, folder: `/docs`**. Preview locally with any static file server, e.g. `npx serve docs`.

## Design tokens

Three-tier system — `global.json` (raw primitives) → `light.json`/`dark.json` (semantic aliases, theme-specific) → per-component token files (`header.json`, `sideNavigation.json`, `badge.json`, `button.json`, `textField.json`, `checkbox.json`, `radioButton.json`, `container.json`, etc.). Components should only ever reference `component.*` or `alias.*` tokens, never `global.*` directly. Full details in [tokens/tokens-structure.md](tokens/tokens-structure.md).

## Extending this library

Read [GUIDELINES.md](GUIDELINES.md) before building anything new — it has the established conventions (exact-vector icons only, reuse the shared icon pack before building something new, extend token files additively, data-driven component APIs, check `core-design-system`'s Lit source as a behavior reference before porting a new component) and a log of past mistakes worth not repeating.

Starting a new component or page template in a fresh session with no chat history? Copy the relevant template as your opening message:
- [component-kickoff-prompt.md](component-kickoff-prompt.md) — a single new component
- [page-template-kickoff-prompt.md](page-template-kickoff-prompt.md) — composing existing components into a layout shell
- [code-connect-kickoff-prompt.md](code-connect-kickoff-prompt.md) — continuing Code Connect mapping work

## Using this in Figma Make

If you're building or converting a prototype rather than working on the library itself, [designer-instructions.md](designer-instructions.md) is the guide to use — it covers both starting a new prototype and converting an existing one, and links out to the specific copy-paste prompts needed for each.

## Figma Make packaging

Published to the public npm registry as a temporary home (`figma-make-bridge`, currently `0.1.8`) to prove the install-in-a-real-prototype flow works end to end — see [GUIDELINES.md](GUIDELINES.md)'s "Packaging" section for the full build setup. Moving to Akamai's private registry still requires an org admin to confirm it's enabled and create a scope; see GUIDELINES.md's "Figma Make private registry" section for that checklist. Every publish also ships [figma-make-guidelines.md](figma-make-guidelines.md) as `dist/Guidelines.md`, the file Figma Make's AI reads for how to use the library correctly.
