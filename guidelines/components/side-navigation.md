# SideNavigation

Left product navigation rail with accordion sections, page rows, badges and a pin control.

## When to use / when not to use

- In a full page, do NOT render it. Pass `sideNavProps` to `DefaultCmPageTemplate` (see composition/page-shell.md). The rules below apply to those props either way.
- Render it directly only for an isolated preview.
- Hidden below 960px inside the page template. No mobile nav drawer exists.

## Import

```tsx
import { SideNavigation, DEFAULT_SIDE_NAV_SECTIONS, type SideNavSection, type SideNavPage } from "figma-make-bridge";
```

## Props

| Prop | Type | Default | Allowed values |
|---|---|---|---|
| `menu` | `"full" \| "mini"` | unset | `"full"`, `"mini"` |
| `sections` | `SideNavSection[]` | `DEFAULT_SIDE_NAV_SECTIONS` | see below |
| `selectedPageId` | `string` | unset (self-managed) | a page `id` |
| `onSelectPage` | `(pageId: string, sectionId: string) => void` | none | |
| `defaultOpenSectionIds` | `string[]` | section of the selected page, else none | section ids |
| `pinned` | `boolean` | unset (self-managed) | |
| `onPinToggle` | `(pinned: boolean) => void` | none | |
| `pinnedExpanded` | `boolean` | `true` | |
| `className` | `string` | none | Replaces ALL default styling |

`SideNavSection`: `{ id: string; label: string; icon: ReactNode; pages: SideNavPage[] }`.
`SideNavPage`: `{ id: string; label: string; badge?: { type: "new" | "beta" } }`.

Default section ids: `compute`, `storage`, `networking`, `databases`, `monitor`, `administration`, `more`.

## Valid values

- `badge.type`: `"new"`, `"beta"`.
- `menu`: `"full"`, `"mini"`.
- Invalid: any other badge type, a `badge` label string, `menu="collapsed"`, `variant`, `theme`.

## Correct

```tsx
const sections = DEFAULT_SIDE_NAV_SECTIONS.map((s) =>
  s.id === "compute"
    ? { ...s, pages: [...s.pages, { id: "gpu", label: "GPU Instances", badge: { type: "new" as const } }] }
    : s
);
```

## Incorrect

```tsx
<SideNavigation selectedPageId="linodes" sections={[{ id: "x", label: "X", pages: [] }]} />
```

Hardcoded `selectedPageId` without `onSelectPage`, and a from-scratch `sections` array.

## Known footguns

- **Adding a page (common):** clone `DEFAULT_SIDE_NAV_SECTIONS` and push a `SideNavPage` into the matching section. Always extend the default. It is the product's real navigation, not a placeholder.
- **Badges:** `badge: { type: "new" }` or `"beta"` only. The row renders a `SystemBadge`. Never use the general `Badge` in a nav row.
- **New section (rare):** every section needs an `icon` from foundations/icons.md. If no icon fits, stop and flag that a real exact-vector icon is needed. Never hand-draw one. Never repurpose `MoreIcon` as a placeholder.
- **Collapse model:** unpinned, the rail rests at 48px (icon-only) and expands to 232px on hover. `pinned` locks it to `pinnedExpanded` and disables hover. `pinned` with `pinnedExpanded={false}` is a valid permanently collapsed rail.
- **Pin props are optional.** Omit `pinned` and `onPinToggle` and the rail manages its own pin state. Pass them together only when the app must read or drive pin state.
- **`menu` override:** forces a static rail with no hover or pin. Use only for an isolated preview or a frozen state. Real screens leave `menu` unset.
- **Selection:** for one static nav state, omit `selectedPageId` and `onSelectPage`. NEVER pass a hardcoded `selectedPageId` without `onSelectPage`. It locks the selection and clicks do nothing. For real multi-page navigation pass both, and make `onSelectPage` update the same state that drives the page content. See composition/page-shell.md.
- Never pass `className`. It replaces the default classes and strips the rail styling.
- **Fixed dark surface:** the side navigation rail stays dark in both light and dark mode. Its colors come from global tokens, listed in the Tokens section below. Do not add theme-specific overrides.
