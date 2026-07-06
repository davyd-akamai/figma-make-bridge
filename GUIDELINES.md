# Project Guidelines & Decisions

Internal log of architecture decisions and direction for `figma-make-bridge`. Update this as decisions are made or revised — this is the source of truth for *why*, not just *what*.

Starting work in a fresh session? Copy the relevant kickoff prompt as your opening message — both point back to this file's conventions so new sessions don't have to rediscover them from scratch:
- [component-kickoff-prompt.md](component-kickoff-prompt.md) — building a single new component (e.g. GlobalFooter)
- [page-template-kickoff-prompt.md](page-template-kickoff-prompt.md) — composing existing components into a page-shell template (e.g. the GlobalHeader + SideNavigation + GlobalFooter base layout for Figma Make prototypes)

## Goal

Build a React component library, extracted from the Akamai internal ADS Figma library, that serves as the SSOT for Figma Make prototypes. What's currently published elsewhere isn't suitable for this purpose — this repo is the canonical source going forward.

## Direction: dual-purpose from the start

Components are built to work both as normal app code *and* as a package installable inside Figma Make — not sequentially, but designed in from day one, per the pattern in [Luke Finch's "How to get your design system into Figma Make"](https://finchy.medium.com/how-to-get-your-design-system-into-figma-make-3ac735205e7f), adapted to our (non-monorepo) setup.

Constraints this puts on every component:
- No app-shell assumptions — no routing, no app-specific context/providers
- `react` / `react-dom` are peer deps, never bundled
- No dynamic imports at runtime (breaks Figma Make's bundler)
- No `workspace:*` protocol deps (n/a while we're a single package, but watch for this if the repo splits)
- Styling via CSS custom properties (`var(--component-*)`) with resolved hex fallbacks — not raw Tailwind JIT classes, since Figma Make won't run our Tailwind build. Compiled `tokens.css` / `typography.css` must ship with the package, not just live in this app.

## Token architecture

Three-tier system, documented in full in [tokens/tokens-structure.md](tokens/tokens-structure.md):
`global.json` (primitives) → `light.json`/`dark.json` (semantic aliases, theme-specific) → per-component token files (`button.json`, `header.json`, etc.)

Rule of thumb: components should reference `component.*` or `alias.*` tokens, never `global.*` directly.

## Component conventions (established with GlobalHeader)

- Cite the source Figma node ID/URL in a header comment
- Responsive behavior mirrors Figma's breakpoint frames (mobile/tablet/desktop) via Tailwind breakpoint classes
- Typography via generated `.type-*` classes
- **Icons: never hand-approximate.** Every icon must be pulled as an exact vector from Figma — `download_assets` with `defaultFormat: "svg"` on the real node (or the closest exportable ancestor, e.g. a `.menu-item` instance row when the icon override itself only has a compound instance ID), then normalize coordinates into a local viewBox (subtract the icon's container offset). Approximating a shape by eye (e.g. a hand-drawn hexagon) is not acceptable even if it "looks close" — this was the exact mistake made in GlobalHeader's first draft (`MenuIcon`/`SearchIcon`/`ChevronDownIcon` were hand-drawn) and had to be redone once flagged.
- **Shared icon pack:** every icon used by any component lives in [components/icons/index.tsx](components/icons/index.tsx), one component per icon, default size 24px (matching this design system's standard icon box — `core_chevron` and `core_pin` are natively 16px and default to that instead). Components import icons from there rather than redefining them locally. Do this even for a component's first icon — don't wait until a second component needs the same icon to extract it.
- Badges (BETA/grey, NEW/violet) are a single shared [components/Badge.tsx](components/Badge.tsx) matching Figma's `cm_global-badge` (node 29:3416) exactly — fixed label text and fixed colors, not a generic customizable badge. **Don't confuse this with `core_badge-reserved` (node 29:2248)** — a different, larger-specced component that isn't what's actually used inline next to labels; got this wrong once already (6px/4px padding, 12px text instead of the correct 4px/2px, 11px). When a design has two similarly-named badge-like components, check which one is actually instantiated in the row you're building (`data-name` in the fetched code) rather than assuming from the name alone.
- When a row has a trailing element (badge, chevron, pin) that should sit immediately after a label rather than pinned to the row's far edge, don't give the label `flex-1` — that stretches it to fill all remaining space and pushes the trailing element to the edge instead of leaving a clean gap. Let the label size to content and rely on the row's `gap` instead.
- Custom scrollbars (e.g. SideNavigation's menu-items list) are done via styled *native* scrollbars (`scrollbar-color` + `::-webkit-scrollbar`), not a reimplemented drag-thumb widget — same visual result as Figma's custom "Thumb" node, far less code
- When a design's token JSON file only has an ambiguous/partial mapping for a new component, extend it additively with clearly-named sibling keys (e.g. `sectionHeader`, `pin`, `scrollbar` added to `sideNavigation.json`) rather than reinterpreting or overwriting the existing ambiguous keys. If a shared component (like Badge) later needs its own tokens, give it its own token file rather than nesting it under the component that happened to use it first.
- Collapsible rails (SideNavigation): unpinned defaults to collapsed (icon-only rail), expands on hover with an eased width transition. Pinning locks the rail to a specific resting state via `pinnedExpanded` (default true) — pin doesn't only mean "locked open", it means "hover has no effect, show whatever `pinnedExpanded` says," so a permanently-collapsed-but-pinned rail is a supported, real variant, not just permanently-open. Implementation detail worth reusing: render full content (icon + label + everything) at all times at a fixed inner width, and animate the *outer* container's width with `overflow-hidden` — this clips/reveals content smoothly instead of swapping between two different DOM layouts (which would jump-cut). **Gotcha that cost a redo:** page/submenu rows must only render when `expanded && open`, never just `open` — rendering them whenever the accordion is "open" (regardless of expanded/collapsed) leaves their height in the layout even while clipped, producing visible gaps between collapsed section icons that shouldn't be there. The pin icon's filled state tracks `pinned` specifically, not transient hover-expansion — matches Figma's own Pinned=Yes/No naming (filled means "locked", not "currently visible"). A component can still take an explicit `menu="full"|"mini"` override to force a static variant with no hover/pin behavior at all (e.g. for isolated previews). Default open section (when `defaultOpenSectionIds` isn't passed) is whichever section contains the initially-selected page, not all sections — matches the reference design where only the active section is expanded by default. **Another gotcha:** any row element whose content is right/end-aligned (like the pin bar) must track the rail's *actual current width* (`w-full`, inheriting the animated parent width), not a hardcoded 232px — the fixed-232-plus-clip trick only works for left-aligned content (icons), since clipping to 48px cuts away anything positioned near the right edge of a 232-wide box. This is why the pin button disappeared entirely in the collapsed state until fixed.
- Node environment note: this repo was carried over from another machine — if `npm run dev` fails with a `@rollup/rollup-*` native-binding error, it's npm's known optional-dependency bug, not a code issue; fix is `rm -rf node_modules package-lock.json && npm install`

## Package-facing Guidelines.md (drafted ahead of packaging)

Content drafted in [figma-make-guidelines.md](figma-make-guidelines.md) — the file Figma Make's AI will read once published. Filename note: this filesystem is case-insensitive (macOS/APFS default), so `Guidelines.md` cannot coexist with this repo's own `GUIDELINES.md` in the same directory as two distinct files. Using `figma-make-guidelines.md` at the root as a placeholder; rename to `Guidelines.md` once actual packaging starts and it moves into the publish output (a different directory than this file).

Drafting decisions:
- Written in a terse, spec-like style (dense bullets, prop tables) rather than a conversational README — optimized for an LLM consumer, not a human developer.
- States up front that this package supersedes any previously-published version of the design system, so Figma Make's AI doesn't blend in patterns from an older kit it may have seen.
- Import examples assume the package publishes under its current repo name, `figma-make-bridge` (package.json name, currently `private: true`) — revisit if the actual published name differs once the private registry is confirmed.
- GlobalHeader: guidance steers hard toward the plain default (`<GlobalHeader />`, authenticated, default logo/search) — `showSearch`/`logo` are treated as fixed brand surface, not per-prototype knobs; `isAuthenticated={false}` is flagged as the sign-in-screen exception, not a starting point.
- SideNavigation: guidance says to always extend the exported `DEFAULT_SIDE_NAV_SECTIONS` array for new pages/sections rather than authoring a parallel `sections` array from scratch — the defaults are treated as the product's real nav structure. A new section with no matching icon should be flagged for a real Figma vector, not filled with a placeholder icon (e.g. reusing `MoreIcon`) or a hand-drawn approximation. `menu="full"|"mini"` is documented as a narrow escape hatch (isolated previews, frozen mocks), not a default rendering path.

## Figma Make private registry (not yet set up)

Requirements once we're ready to publish:
- Akamai org must be on Organization/Enterprise plan (private registry requires this)
- Org admin creates a unique scope (Admin → Resources → npm registry) and issues the `.npmrc` auth token
- Package must build with Vite + React 18
- Ship a `Guidelines.md` in the published package specifically for Figma Make's AI — this is separate from this file; that one teaches Figma Make how to compose our components, this one records our own decisions

Open question: confirm with Akamai's Figma admin that the private registry is actually enabled for our org before assuming it.

## Preview harness (src/App.tsx)

Not shipped, dev-only. Structure: one section per component (labeled with a plain `<h2 className="type-heading-m">` — "Icons", "Global Header", "Side Navigation") so multiple demo states don't blur together. The Icons section renders every export from `components/icons` directly (no per-icon labels needed) in a `flex-wrap` row so it doubles as a visual regression check when a new icon is added. Interactive components should demo more than one state side by side (e.g. SideNavigation shown once expanded+pinned and once collapsed+pinned) rather than just one default instance.

## Component roadmap

- [x] GlobalHeader — [components/GlobalHeader.tsx](components/GlobalHeader.tsx), first draft, Figma node 1:882
- [x] SideNavigation — [components/SideNavigation.tsx](components/SideNavigation.tsx), Figma node 17:2719 (`cm_side-navigation`), 7 sections (Compute, Storage, Networking, Databases, Monitor, Administration, More). Accordion open/close, page selection (bubbles up to highlight the parent section header per node 17:2743's interaction spec), hover-to-expand/pin-to-lock collapsible rail, exact-vector icons via [components/icons](components/icons/index.tsx), NEW/BETA page badges via [components/Badge.tsx](components/Badge.tsx).
- [x] GlobalHeader icons retrofitted to exact Figma vectors and moved into the shared icon pack (was the original instance of the "hand-approximated icon" mistake — see conventions above)
- [ ] GlobalFooter — needs token extraction first (no `footer.json` exists yet)
