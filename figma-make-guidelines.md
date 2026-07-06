# Guidelines

Guidance for Figma Make's AI on composing UI with this package's components. This file is package-facing and ships inside the published package — it is the sole reference Figma Make reads for this design system; it does not get cross-referenced against other files in any guaranteed order, so every section below is self-contained.

## Overview

- This package (`figma-make-bridge`) is the single source of truth for building app UI inside Figma Make prototypes. It supersedes any previously-published version of this design system — treat it as canonical and do not blend in patterns from an older kit.
- Stack: React 18 + Vite. Peer dependencies are `react` and `react-dom` (^18.3) — never bundled, never duplicated.
- Every component is self-contained: no app-shell assumptions, no routing dependency, no app-specific context or providers required to render.
- Styling ships as compiled CSS (design tokens as CSS custom properties, plus generated typography classes). Import the package's stylesheet once at the app root alongside the components — do not recreate colors, spacing, or type styles by hand.

## Design tokens

- Three-tier architecture: `global.*` (raw primitives: hex colors, spacing scale, font primitives) → `alias.*` (semantic, theme-resolved for light/dark) → `component.*` (component-specific, e.g. `component.badge.new.background`).
- Never use a raw hex value or a `global.*` token when composing or configuring a component. Every color/spacing decision should resolve through a `component.*` or `alias.*` token.
- Theming (light/dark) resolves automatically based on which alias set is active in the surrounding app — components do not take a `theme` prop, and one should not be added.
- Every exported component already has its tokens wired in. There is no supported per-instance override for a component's colors or spacing via props — customization is a token-file concern, not a prop.

## Component reference

### GlobalHeader

```ts
interface GlobalHeaderProps {
  isAuthenticated?: boolean;       // default true
  user?: { name: string; avatarInitial: string };
  showSearch?: boolean;            // default true
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  onCreateClick?: () => void;
  onSignInClick?: () => void;
  onMenuClick?: () => void;
  notificationCount?: number;
  logo?: ReactNode;
  className?: string;
}
```

- Default usage covers ~99% of real prototypes: render `<GlobalHeader />` with no props, or with just the callback handlers and `user`/`notificationCount` wired to prototype state. Do not treat `showSearch` or `logo` as things to vary per-prototype — they're fixed brand/product surface, not per-screen configuration. Only touch them for an explicit non-Akamai white-label case.
- `isAuthenticated` defaults to `true`. Only set it `false` for a prototype that specifically depicts a signed-out/sign-in screen — the signed-out state (a bare "Sign in" link, no avatar/account) is the exception, not a starting point.
- Responsive behavior (mobile 320–599px / tablet 600–959px / desktop 960px+) is handled internally via CSS breakpoints — it is not a prop and there is no `type`/`variant` prop to select a layout. Rendering the component at different container widths is sufficient; don't attempt to force a specific breakpoint's layout at a different width.
- `notificationCount`: omit or pass `0` to hide the notification badge entirely; counts above 9 render as "9+".

### SideNavigation

```ts
interface SideNavPage {
  id: string;
  label: string;
  badge?: { type: "new" | "beta" };
}
interface SideNavSection {
  id: string;
  label: string;
  icon: ReactNode;
  pages: SideNavPage[];
}
interface SideNavigationProps {
  menu?: "full" | "mini";          // static override, see below
  sections?: SideNavSection[];     // defaults to DEFAULT_SIDE_NAV_SECTIONS
  selectedPageId?: string;
  onSelectPage?: (pageId: string, sectionId: string) => void;
  defaultOpenSectionIds?: string[];
  pinned?: boolean;
  onPinToggle?: (pinned: boolean) => void;
  pinnedExpanded?: boolean;        // default true
  className?: string;
}
```

**Adding a page to an existing section (the common case):** import `DEFAULT_SIDE_NAV_SECTIONS`, clone it, and push a new `SideNavPage` into the matching section's `pages` array. Always extend the default export — don't author a parallel `sections` array from scratch, since `DEFAULT_SIDE_NAV_SECTIONS` is the product's real navigation structure, not a placeholder.

**Applying a badge:** `badge: { type: "new" }` or `badge: { type: "beta" }` only. This is a fixed enum, not free text — never invent another badge type or pass a label string.

**Adding a brand-new section (rare):** every section needs an `icon: ReactNode` from [components/icons](components/icons/index.tsx). If no existing icon fits, this is not something to solve with a prop edit — stop and flag that the section needs a real icon exported from Figma as an exact vector. Do not hand-approximate a shape and do not repurpose an unrelated existing icon (e.g. `MoreIcon`) as a placeholder.

**Collapse/expand/pin model:** unpinned (default), the rail rests collapsed (48px, icon-only) and expands to 232px on hover. `pinned={true}` locks the rail to whatever `pinnedExpanded` says (default `true`, i.e. locked open) and disables hover entirely — a permanently-collapsed-but-pinned rail (`pinned pinnedExpanded={false}`) is a valid, supported state, not just "always open." `onPinToggle` fires when the user clicks the pin control; the component does not persist pin state itself.

**`menu="full"|"mini"` override:** a narrow escape hatch that forces a static rail with no hover/pin behavior at all — use only for an isolated component preview or a screen that must freeze in one exact state. Default (real app screens) should leave `menu` unset and rely on the interactive hover/pin model above.

**Selection:** `selectedPageId`/`onSelectPage` control which page is active; selecting a page also highlights its parent section header (this is automatic, not something to wire up separately). `defaultOpenSectionIds` controls which accordion sections start expanded — if omitted, only the section containing the initially-selected page starts open.

### Badge

```ts
interface BadgeProps {
  type: "beta" | "new";
  className?: string;
}
```

- Fixed states only: `"new"` renders violet "NEW", `"beta"` renders grey "BETA". There is no label-override prop and none should be added — this mirrors the real Figma component (`cm_global-badge`) exactly, which itself has no free-text variant.
- Used inline next to a label (e.g. a SideNavigation page row) — compose it via the `badge` field on the relevant data model (see SideNavigation above) rather than rendering `<Badge>` directly in most cases.

### Icon pack

- One React component per icon in [components/icons](components/icons/index.tsx) — e.g. `ComputeIcon`, `BucketIcon`, `PinIcon`. All accept `size?: number` plus standard SVG props.
- Default size is 24px, matching this design system's icon box. `ChevronUpIcon`/`ChevronDownIcon` and `PinIcon` are natively 16px and default to that instead.
- When composing a new `SideNavSection`, pass an icon element directly as the `icon` field, e.g. `icon: <ComputeIcon />`. Only use icons already exported from this pack — do not hand-draw a new icon inline. A section that needs an icon not in the pack needs a new exact-vector icon pulled from Figma, not an approximation (see the SideNavigation section above).

## Composition examples

**Basic app shell (defaults cover almost every case):**

```tsx
import { GlobalHeader, SideNavigation } from "figma-make-bridge";

export default function AppShell() {
  return (
    <div className="flex h-screen flex-col">
      <GlobalHeader />
      <div className="flex flex-1">
        <SideNavigation selectedPageId="linodes" />
        <main className="flex-1">{/* page content */}</main>
      </div>
    </div>
  );
}
```

**Adding a product to an existing section, with a badge:**

```tsx
import { DEFAULT_SIDE_NAV_SECTIONS, SideNavigation, type SideNavSection } from "figma-make-bridge";

const sections: SideNavSection[] = DEFAULT_SIDE_NAV_SECTIONS.map((section) =>
  section.id === "compute"
    ? {
        ...section,
        pages: [...section.pages, { id: "gpu-instances", label: "GPU Instances", badge: { type: "new" } }],
      }
    : section
);

<SideNavigation sections={sections} selectedPageId="gpu-instances" />;
```

**Frozen rail for an isolated preview (narrow escape hatch, not the default):**

```tsx
<SideNavigation menu="mini" />
```

## Known constraints / things not to attempt

- Import every component statically. Do not wrap any import from this package in a dynamic `import()` — Figma Make's bundler does not support it.
- Do not wrap these components in app-shell dependencies (routing providers, app-specific context) — none is required, and adding one is not solving a real constraint.
- Do not add a `theme` prop to any component, or pass raw hex/inline-style color overrides — theming and customization are both token-file concerns (see Design tokens above), never props.
- GlobalHeader: do not add a `type`/`variant` prop to pick a responsive layout — breakpoints are automatic CSS, not a prop surface.
- Badge: do not add a label-override prop or a third state beyond `"new"`/`"beta"`.
- SideNavigation: do not invent a badge type beyond `"new"`/`"beta"`; do not add a brand-new section without a real icon (flag it instead, see SideNavigation above); reach for `menu="full"|"mini"` only as a narrow escape hatch, not the default way to render the rail.
- Layout rule for any row with a trailing element that should sit immediately after a label with a gap (a badge, chevron, or icon): never give the label `flex-1`. That stretches the label to fill all remaining space and pushes the trailing element to the row's far edge instead of leaving a clean gap next to the label. Let the label size to content and rely on the row's `gap`.
