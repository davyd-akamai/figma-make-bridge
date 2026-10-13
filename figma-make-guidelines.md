# Guidelines

Guidance for Figma Make's AI on composing UI with this package's components. This file is package-facing and ships inside the published package — it is the sole reference Figma Make reads for this design system; it does not get cross-referenced against other files in any guaranteed order, so every section below is self-contained.

## Overview

- This package (`figma-make-bridge`) is the single source of truth for building app UI inside Figma Make prototypes. It supersedes any previously-published version of this design system — treat it as canonical and do not blend in patterns from an older kit.
- Stack: React 18 + Vite. Peer dependencies are `react` and `react-dom` (^18.3) — never bundled, never duplicated.
- Every component is self-contained: no app-shell assumptions, no routing dependency, no app-specific context or providers required to render.
- Styling ships as compiled CSS (design tokens as CSS custom properties, plus generated typography classes). Import the package's stylesheet once at the app root alongside the components — do not recreate colors, spacing, or type styles by hand.
- Theme: this version supports the light theme only. Components have no `theme` prop and none should be added. Components and alias variables will carry dark values in a later version — that is why the token rules in "Design tokens" must be followed exactly.

## Components first

Before writing any UI, work down this list in order and stop at the first step that works:

1. **Use a library component.** If a component in "Component reference" does the job, use it, configured only through its documented props.
2. **Compose from library components plus layout.** If no single component fits, build the UI from several library components arranged with plain layout (flex/grid, spacing from the global scale).
3. **Build a custom element — last resort.** Only if neither 1 nor 2 works, build custom markup, styled strictly per "Design tokens" below. **State this in the reply** (what was built custom and why no library component fit) so the team can consider adding a real component.

- Do not invent variants, props, or states on library components (no extra `variant` values, no new props, no `theme`). If a needed variant or prop does not exist, that is a step-3 situation — say so; do not fake it with `className`/`style` overrides.
- Do not hand-build a replacement for something a library component already does (buttons, inputs, selects, tabs, tables, drawers, badges, footers, headers).

## Design tokens

- Three tiers, all exposed by the package stylesheet as CSS custom properties: `--global-*` (primitives: color palette, spacing scale), `--alias-*` (semantic colors and elevation), `--component-*` (per-component values). Font primitives are `--font-*` and `--line-height-*`.
- **Library components already use their own `--component-*` variables.** Do not touch them: never reference `--component-*` variables in app code, never pass color overrides to a library component. Customization of a library component is not possible per instance.
- **Custom UI (step 3 of "Components first" only) — color rules:**
  1. Colors must use alias variables: `var(--alias-...)`. See "Alias reference" below for what exists and when to use each.
  2. `--global-color-*` is a rare last resort, allowed only when no alias variable fits. If you use one, **mention it in the reply** (which variable, and why no alias fit).
  3. Never use a raw hex, `rgb()`/`rgba()`/`hsl()` value, or a named color (`white`, `red`, …) anywhere.
- **Exempt from the tier rule above:**
  - Spacing comes from the global scale: `var(--global-spacing-s0|s2|s4|s6|s8|s12|s16|s20|s24|s28|s32|s36|s40|s48|s64|s72|s96)`. Use only these steps.
  - Text uses the `.type-*` classes (see "Typography").
- Only the variable names listed in this file exist. Do not invent `--alias-*` names.

### Alias reference

Variable name = `--alias-` + path, lowercase, no separators inside a word (camelCase keys in the source become lowercase, e.g. `primaryhover`). "No description" means the source token file gives no usage note; the guidance there is derived from the name only.

**Text** — `--alias-content-text-<name>`

| Name | Use |
|---|---|
| `base` | Text on a dark surface |
| `primary-default` | Primary text color |
| `primary-disabled` | Only to indicate a disabled state of primary text |
| `secondary-default` | Secondary text (placeholders, hints) |
| `secondary-disabled` | Only to indicate a disabled state of secondary text |
| `link-default` | Only for links |
| `link-hover` | Only as a hover state on links |
| `link-disabled` | Only to indicate a disabled link |
| `negative` | Error messages |
| `warning`, `positive`, `informative` | No description — status-colored text by name |

**Icon** — `--alias-content-icon-<name>`

| Name | Use |
|---|---|
| `base` | Icons on a dark surface |
| `primary-default` | Default icon color |
| `primary-hover` | Only as a hover state for icons |
| `primary-active` | Only as a selected/active state for icons |
| `primary-disabled` | Only as a disabled state for icons |
| `secondary-default` | Secondary icon color (placeholder, etc.) |
| `secondary-disabled` | Only as a disabled state for a secondary icon |
| `negative` | Only for icons indicating an error state |
| `warning` | Only for icons indicating a warning state |
| `positive` | Only for icons indicating a success state |
| `informative` | Only for icons indicating an info state |
| `recommendation` | Only for icons indicating a recommendation state |

**Border** — `--alias-border-<name>`

| Name | Use |
|---|---|
| `normal` | Border for static UI elements and components |
| `neutral` | No description — neutral border by name |
| `negative` | Only for borders indicating an error state |
| `warning` | Only for borders indicating a warning state |
| `positive` | Only for borders indicating a success state |
| `informative` | Only for borders indicating an info state |
| `recommendation` | Only for borders indicating a recommendation state |

**Background** — `--alias-background-<name>`

| Name | Use |
|---|---|
| `normal` | Primary background color |
| `neutral` | Page background color |
| `base` | Tooltip background |
| `black` | Only for a global header and global footer background |
| `overlay` | Page dimming when a modal component is active |
| `negative`, `warning`, `positive`, `informative` | No description — solid status backgrounds by name |
| `negativesubtle`, `warningsubtle`, `positivesubtle`, `informativesubtle`, `recommendationsubtle`, `neutralsubtle` | No description — subtle (light tint) status backgrounds by name |

**Action** — `--alias-action-<name>` (fills for actionable surfaces; library `Button` already uses these)

| Name | Use |
|---|---|
| `primary-default` | Brand action color |
| `white50` | Transparent disabled switcher circle |
| `base`, `neutral` | No description — base/neutral action fills by name |
| `primary-hover`, `primary-active`, `primary-disabled` | No description — primary action states by name |
| `secondary-hover`, `secondary-disabled` | No description — secondary action states by name |
| `tertiary-default`, `tertiary-disabled` | No description — tertiary action states by name |
| `positive-default`, `positive-hover`, `positive-active`, `positive-disabled` | No description — positive (success) action states by name |
| `negative-default`, `negative-hover`, `negative-active`, `negative-disabled` | No description — negative (destructive) action states by name |

**Interaction** — `--alias-interaction-<group>-<name>` (field and surface states)

| Name | Use |
|---|---|
| `border-default` | Default inputs border |
| `border-hover`, `border-focus`, `border-error`, `border-disabled`, `border-light` | No description — input border states by name |
| `background-primary` | Default component background color |
| `background-primaryhover` | Calendar range background, table row hover |
| `background-primaryactive` | Active/selected backgrounds |
| `background-secondaryhover` | Hover color for a calendar date range |
| `background-secondary`, `background-secondaryactive`, `background-tertiary`, `background-tertiaryhover`, `background-tertiaryactive`, `background-neutral`, `background-neutralhover`, `background-neutralactive`, `background-disabled` | No description — background states by name |

**Accent** — `--alias-accent-<hue>-primary` / `--alias-accent-<hue>-secondary`. No descriptions in the source. By name and value: `primary` is the solid color, `secondary` is a 12% translucent tint of the same hue. Hues: `info`, `neutral`, `warning`, `negative`, `positive`, `important`, `recommendation`, `pink`, `violet`. Also `--alias-accent-disabled`.

**Elevation** — `--alias-elevation-<name>` (box-shadow values: use with `box-shadow`, never as a color)

| Name | Use |
|---|---|
| `s` | Default shadow for components like notification banners, dropdowns, popups |
| `s-inverted` | Inverted shadow for elements that appear above the component |
| `l` | Shadow for modals |
| `drawer-right`, `drawer-left`, `drawer-top`, `drawer-bottom` | Drawer elevation by the side the drawer appears from |

**Chart** — no descriptions in the source; by name only. Use for data visualization, not general UI.

- `--alias-chart-neutral`
- `--alias-chart-categorical-<1..22>-primary` / `-inactive` / `-transparent` (one series color per number; `inactive` and `transparent` are lighter/translucent variants of that series color)
- `--alias-chart-monochromatic-default-<5|10|20|30|40|50|60|70|90|100>` and `--alias-chart-monochromatic-danger-<5|10|20|30|40|50|60|70|90|100>` (light-to-dark ramps)
- `--alias-chart-status-negative`, `--alias-chart-status-warning`, `--alias-chart-status-positive`

**Applying an alias variable in custom markup (step 3 only):**

```tsx
<div
  className="type-body-regular"
  style={{
    background: "var(--alias-background-informativesubtle)",
    border: "1px solid var(--alias-border-informative)",
    color: "var(--alias-content-text-primary-default)",
    padding: "var(--global-spacing-s12) var(--global-spacing-s16)",
  }}
>
  Heads-up message in a custom callout.
</div>
```

## Typography

- **Every piece of text in the UI must render in this system's brand typeface — `Nunito Sans` (`Fira Code` for code/monospace text only).** Never set a different `font-family`, never fall back to a host environment's default font, and never add your own `<link>`/`@import` for a font — both typefaces are already self-hosted (embedded directly) inside this package's compiled stylesheet, so importing `figma-make-bridge/styles.css` once at the app root is sufficient on its own.
- Hierarchy is expressed entirely through the generated `.type-*` classes below — one class per Figma text style, each fixing `font-family` + `font-weight` + `font-size` + `line-height` together as a unit. Apply the matching class to every text element; never hand-set `font-size`, `font-weight`, or `line-height` directly, and never mix a `.type-*` class with a manual override of any of those four properties.
- Picking a class: match it to the text's actual role in the layout, not to how large you want it to look.

| Class | Weight | Size | Line height | Use for |
|---|---|---|---|---|
| `type-heading-xxxl` | Bold | 2.25rem | 2.625rem | Page-level hero heading (rare — most pages don't need one) |
| `type-heading-xxl` | Extrabold | 1.625rem | 2rem | Top-level page title |
| `type-heading-xl` | Bold | 1.5rem | 1.875rem | Major section heading |
| `type-heading-l` | Bold | 1.25rem | 1.625rem | Subsection heading |
| `type-heading-m` | Bold | 1.125rem | 1.5rem | Card/panel/group title |
| `type-heading-s` | Bold | 1rem | 1.25rem | Minor heading, compact contexts |
| `type-heading-xs` | Bold | 0.875rem | 1.125rem | Smallest heading, table/list group headers |
| `type-heading-overline` | Extrabold | 0.75rem | 1rem | Small uppercase eyebrow/overline label above a heading |
| `type-body-regular` | Regular | 0.875rem | 1.25rem | Default paragraph/body copy |
| `type-body-semibold` | Semibold | 0.875rem | 1.25rem | Emphasized inline body text |
| `type-body-bold` | Bold | 0.875rem | 1.25rem | Strongly emphasized inline body text |
| `type-body-extrabold` | Extrabold | 0.875rem | 1.25rem | Rare, heaviest inline emphasis |
| `type-body-italic` | Regular italic | 0.875rem | 1.25rem | Asides, captions, quoted text |
| `type-body-list` | Regular | 0.875rem | 1.25rem | List item text |
| `type-label-bold-l` | Bold | 1rem | 1.25rem | Form labels, table headers, emphasized UI labels (large) |
| `type-label-bold-s` | Bold | 0.875rem | 1rem | Form labels, table headers, emphasized UI labels (small) |
| `type-label-bold-xs` | Bold | 0.75rem | 0.875rem | Form labels, table headers, emphasized UI labels (extra small) |
| `type-label-semibold-l` | Semibold | 1rem | 1.25rem | Standard UI labels — buttons, nav items, chips (large) |
| `type-label-semibold-s` | Semibold | 0.875rem | 1rem | Standard UI labels — buttons, nav items, chips (small) |
| `type-label-semibold-xs` | Semibold | 0.75rem | 1rem | Standard UI labels — buttons, nav items, chips (extra small) |
| `type-label-regular-s` | Regular | 0.875rem | 1rem | Secondary/de-emphasized UI labels (small) |
| `type-label-regular-xs` | Regular | 0.75rem | 1rem | Secondary/de-emphasized UI labels (extra small) |
| `type-label-regular-placeholder` | Regular italic | 0.875rem | 1rem | Input placeholder text specifically |
| `type-code` | Regular, `Fira Code` | 0.813rem | 1.25rem | Inline code / monospace snippets only |

- If a screen genuinely needs text styling this table doesn't cover, treat that as a gap to flag rather than inventing a one-off `font-size`/`font-weight` value — the same rule as colors and spacing in "Design tokens": customization is a token/class-file concern, not something to improvise per-instance.

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
- In a full page, configure the header through `headerProps` on `DefaultCmPageTemplate` (see that section) instead of rendering `GlobalHeader` yourself; render it directly only for an isolated preview.

### GlobalFooter

```ts
interface GlobalFooterLink {
  id: string;
  label: string;
  href: string;
  target?: string;
}
interface GlobalFooterProps {
  links?: GlobalFooterLink[];
  copyrightText?: string;
  className?: string;
}
```

- Default usage: render `<GlobalFooter />` with no props. Defaults are three links (a version label, "API Reference", "Provide Feedback", all with placeholder `href="#"`) and a copyright line `© {current year} Akamai Technologies, Inc. All Rights Reserved`.
- Pass `links` only to replace the whole link list (each link needs a unique `id`). `target="_blank"` automatically adds `rel="noopener noreferrer"`. Do not invent link icons or other per-link props — none exist.
- `copyrightText` replaces the full copyright string; omit it to keep the dynamic-year default.
- Layout is responsive via CSS breakpoints (stacked column below 960px, single row at 960px+) — not a prop.
- In a full page, configure the footer through `footerProps` on `DefaultCmPageTemplate` (see that section) instead of rendering `GlobalFooter` yourself; render it directly only for an isolated preview.

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

- In a full page, configure the rail through `sideNavProps` on `DefaultCmPageTemplate` (see that section) instead of rendering `SideNavigation` yourself. The rules below apply to those props either way.

**Adding a page to an existing section (the common case):** import `DEFAULT_SIDE_NAV_SECTIONS`, clone it, and push a new `SideNavPage` into the matching section's `pages` array. Always extend the default export — don't author a parallel `sections` array from scratch, since `DEFAULT_SIDE_NAV_SECTIONS` is the product's real navigation structure, not a placeholder.

**Applying a badge:** `badge: { type: "new" }` or `badge: { type: "beta" }` only. The page row renders a `SystemBadge` (fixed NEW/BETA — see the SystemBadge section) from this field. This is a fixed enum, not free text — never invent another badge type, never pass a label string, and do not put the general-purpose `Badge` in a nav row.

**Adding a brand-new section (rare):** every section needs an `icon: ReactNode` from the Icon pack (see the Icon pack section below). If no existing icon fits, this is not something to solve with a prop edit — stop and flag that the section needs a real icon exported from Figma as an exact vector. Do not hand-approximate a shape and do not repurpose an unrelated existing icon (e.g. `MoreIcon`) as a placeholder.

**Collapse/expand/pin model:** unpinned (default), the rail rests collapsed (48px, icon-only) and expands to 232px on hover. `pinned={true}` locks the rail to whatever `pinnedExpanded` says (default `true`, i.e. locked open) and disables hover entirely — a permanently-collapsed-but-pinned rail (`pinned pinnedExpanded={false}`) is a valid, supported state, not just "always open." **`pinned`/`onPinToggle` are optional, not a pair you must always supply together:** omit both and the rail manages its own pin state internally (clicking the pin control just works, no wiring needed) — this is the right default for most screens. Only pass `pinned`/`onPinToggle` together when the surrounding app genuinely needs to read or drive pin state from outside (e.g. persisting it, or a "collapse all navs" control elsewhere on the page).

**`menu="full"|"mini"` override:** a narrow escape hatch that forces a static rail with no hover/pin behavior at all — use only for an isolated component preview or a screen that must freeze in one exact state. Default (real app screens) should leave `menu` unset and rely on the interactive hover/pin model above.

**Selection:** same controlled/uncontrolled split as pinning above. **For a screen with one static nav state (the common case, e.g. a single starter/demo screen), omit `selectedPageId` and `onSelectPage` entirely** — the rail tracks its own selection internally and clicking a page just works. **Never pass `selectedPageId` as a fixed/hardcoded value without also passing `onSelectPage`** — that combination *locks* the selection permanently (a plain React controlled-prop rule: a value with no handler to change it can't change), so clicking a different page will visibly do nothing. Only pass both together, wired to real state, when the app actually swaps rendered page content based on which nav item is selected (real multi-page navigation) — and in that case `onSelectPage` must update the same state that drives what's shown in `DefaultCmPageTemplate`'s content slot, not just the nav highlight. `defaultOpenSectionIds` controls which accordion sections start expanded — if omitted, only the section containing the initially-selected page starts open (or no section, if selection is also omitted).

### DefaultCmPageTemplate

```ts
interface DefaultCmPageTemplateProps {
  children: ReactNode;
  headerProps?: Omit<GlobalHeaderProps, "className">;
  sideNavProps?: Omit<SideNavigationProps, "className">;
  footerProps?: Omit<GlobalFooterProps, "className">;
  className?: string;
}
```

- This is the page shell for every full screen: it composes `GlobalHeader` + `SideNavigation` + `GlobalFooter` around a `children` content slot. Use it instead of assembling those three yourself, and never nest a second `GlobalHeader`/`SideNavigation`/`GlobalFooter` inside `children`.
- Configure the three shell parts through the prop bags, not by rendering them: `headerProps` takes any `GlobalHeaderProps` except `className`, `sideNavProps` any `SideNavigationProps` except `className`, `footerProps` any `GlobalFooterProps` except `className`. The rules in the GlobalHeader, SideNavigation and GlobalFooter sections apply to those bags (e.g. don't put `selectedPageId` in `sideNavProps` without `onSelectPage`). All three bags are optional — `<DefaultCmPageTemplate>…</DefaultCmPageTemplate>` alone is a complete, valid shell.
- **Content slot rules (`children`):** the template provides the page background (`alias.background.neutral`, the light grey page color), and the slot is `max-width: 1280px`, horizontally centered, with built-in padding (16px left/right, 24px top, 32px bottom). The template owns background, centering, max-width and outer padding — do not add your own page background, centering wrapper, `max-width`, or outer padding around the page content, and never render content wider than 1280px or break out with negative margins. Inside the slot, stack `Container`s vertically (see Container).
- Scroll model (not configurable): the whole page scrolls as one document; the header scrolls away; `SideNavigation` stays fixed in view; the footer sits at the viewport bottom on short pages and follows the content on long ones. Do not wrap the template in your own scroll container or fixed-height wrapper.
- Below 960px the `SideNavigation` is hidden entirely (no mobile nav drawer exists in this version).

### Badge

```ts
type BadgeType = "subtle" | "accent";
type BadgeColor = "ultramarine" | "purple" | "pink" | "neutral" | "amber" | "green" | "red";
interface BadgeProps {
  type?: BadgeType;        // default "subtle"
  color?: BadgeColor;      // default "ultramarine"
  icon?: boolean;          // default false
  label?: string;          // default "Badge"
  className?: string;
}
```

- General-purpose status/label badge. `type="subtle"` is a light tinted badge, `type="accent"` is a solid-color badge with white text. `icon` shows a small leading dot in the badge's text color — it is a boolean, not an icon slot; you cannot swap in a different icon.
- `color` takes exactly the 7 values above and nothing else. These are the design's literal color names, not status words: do not pass `"positive"`, `"negative"`, `"warning"`, `"informative"` or `"important"` (those are internal token names and render an unstyled badge). Map meaning to color yourself — e.g. `green` for success, `red` for error, `amber` for warning, `ultramarine` for informative.
- `label` is free text; keep it short (the badge is a fixed 20px-tall single-line pill and does not wrap).
- Use for status or category labels in tables, headers and tabs. For the fixed NEW/BETA marker next to a navigation label, use `SystemBadge` instead (see below), not `Badge`.

### SystemBadge

```ts
interface SystemBadgeProps {
  type: "beta" | "new";
  className?: string;
}
```

- Fixed content only: `"new"` renders violet "NEW", `"beta"` renders grey "BETA". There is no label-override prop and none should be added — it mirrors the real Figma component (`cm_global-badge`) exactly, which has no free-text variant.
- Used inline next to a label (e.g. a SideNavigation page row). For navigation, set the `badge` field on the `SideNavPage` data model (see SideNavigation) rather than rendering `<SystemBadge>` yourself. For any other status/label badge, use `Badge`.

### Button

```ts
interface ButtonProps {
  variant?: "primary" | "secondary" | "link" | "danger"; // default "primary"
  size?: "large" | "small";                               // default "large"
  loading?: boolean;
  disabled?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  children: ReactNode;
  // plus standard <button> props (onClick, type, etc.)
}
```

- Fixed set of 4 variants only — `"primary"` (solid, the default/main CTA), `"secondary"` (outlined), `"link"` (text-only, no border/background/fixed height), `"danger"` (solid, destructive actions like delete). Do not invent a `"tertiary"` or `"icon"` variant — neither has a verified Figma spec in this system yet.
- `loading`: keeps the button's size and hides its label/icons behind a centered spinner — use for an async action in flight (e.g. submitting a form), not as a permanent state.
- `startIcon`/`endIcon` accept an icon element from the Icon pack (see the Icon pack section below) — same rule as everywhere else in this system: only icons already in the pack, never hand-drawn.
- This is the only button primitive in the system — do not hand-build a custom `<button>` with inline Tailwind classes anywhere a `Button` would do the job (a row action, a modal's Save/Cancel, a page-level CTA). Reach for `variant`/`size` to fit the context, don't reimplement the visual treatment.
- **Never pass `Button` directly as the child of a Radix `asChild` trigger** — `PopoverTrigger asChild`, `TooltipTrigger asChild`, `DropdownMenuTrigger asChild`, `DialogTrigger asChild`, or any other Radix primitive using the `asChild` pattern. Radix's `Slot` clones its single child via `cloneElement` and merges its own DOM props onto it, which can clobber `Button`'s own `variant`/`size` props that its internal rendering depends on and crash the render. Instead, wrap `Button` in a plain `<span className="inline-flex">` and make that span the `asChild` target, with `Button` nested inside as a plain visual child — clicks bubble through to the span normally, so behavior is unaffected:
  ```tsx
  <PopoverTrigger asChild>
    <span className="inline-flex">
      <Button variant="secondary" size="small">Settings</Button>
    </span>
  </PopoverTrigger>
  ```

### Container

```ts
interface ContainerProps {
  children: ReactNode;
  className?: string;
  // plus standard <div> props
}
```

- A generic bordered content surface (component-token background and border, 24px horizontal / 16px vertical padding) — use it to group related content inside a page's content slot.
- **Always spans the full available width of its parent grid/content area, regardless of its children's size.** It never shrinks to fit its content, and multiple `Container`s are never placed side by side in a row — stack them vertically. Do not set an explicit `width`/`max-width` on it or wrap it in a flex row expecting it to sit next to another element.
- Height is intrinsic to content — do not set a fixed height.
- It is a plain box: no header, footer or title regions. Compose those yourself inside it (typically a `.type-heading-*` title, `Button`s, a label/value layout).
- Do not put a `Table` inside a `Container`: `Table` owns its own bordered wrapper and needs edge-to-edge header shading, which `Container`'s padding would break.

### Checkbox

```ts
interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  indeterminate?: boolean;
  label?: string;
  size?: "small" | "large";        // default "large"
  disabled?: boolean;
  readOnly?: boolean;
  infoIcon?: boolean;
  infoText?: string;
  onInfoIconClick?: () => void;
  className?: string;
  // plus standard <input> props (name, value, required, etc.)
}
```

- **Default `size` is `"large"` (20px) — use it for almost every checkbox on a page:** standalone form fields, settings/preference toggles, filter lists, any checkbox that isn't inside a table row or a dense list. Do not reach for `size="small"` as a general default.
- **`size="small"` (16px) is reserved for tables and dense list components** — row-selection checkboxes in a table body/header, or list items where vertical space is tight and a 20px control would visually crowd the row. Use it only in those two contexts, not as a general stylistic choice. (`Table` already renders its own selection checkboxes at `small` — don't build them yourself.)
- `indeterminate` is a separate visual flag from `checked`, not a third value of it. For a "select all" checkbox driving a set of child checkboxes, compute it fresh on every render as `someChecked && !allChecked` — it does not clear itself on click, the parent state is what drives it.
- `readOnly` and `disabled` are both non-interactive but communicate different things and render differently (readOnly: thin border, no fill; disabled: greyed fill) — don't substitute one for the other.
- `infoIcon`/`infoText`/`onInfoIconClick` follow the same pattern as TextField's info icon (a placeholder for a future Tooltip component) — use only when the label genuinely needs supplementary explanation, not as a decorative default.

### TextField

```ts
interface TextFieldProps {
  label?: string;
  labelPosition?: "top" | "left";   // default "top"
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  helperText?: string;
  errorText?: string;
  infoIcon?: boolean;
  infoText?: string;
  onInfoIconClick?: () => void;
  clearable?: boolean;              // default true
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  // plus standard <input> props (placeholder, name, required, type, etc.)
}
```

- Omit `label` entirely for an unlabeled field (pass an explicit `aria-label` instead). `labelPosition="left"` puts the label beside the field rather than above it — use for compact form rows, not as a general default.
- `errorText` both shows an error message below the field and switches it into its red-border error state in one prop — don't try to drive the error visual separately from the message.
- `helperText` is hidden automatically while `errorText` is present — no need to conditionally omit one when passing the other.
- `clearable` defaults to `true` (shows a × button once the field has a value) — set `false` only when clearing genuinely doesn't make sense (e.g. a fixed/derived value).
- `readOnly` renders as plain text with no input box or clear button — a different visual from `disabled` (greyed-out but still box-shaped). Use `readOnly` for displaying a value the user can't edit in this context, `disabled` for a value that's temporarily not editable.
- `infoIcon`/`infoText`/`onInfoIconClick`: same placeholder-for-a-future-Tooltip pattern as `Checkbox` — use only when the label genuinely needs supplementary explanation.
- **`TextField` has no leading icon.** There is deliberately no leading/start-icon prop on this component. For a search-style input with a leading magnifier icon, use the `Search` component instead. Don't approximate a leading icon by absolutely-positioning one over a `TextField`.
- **Don't let `TextField` stretch to fill its container by default.** The component itself is `width: 100%` of whatever wraps it, so width is a layout decision made by the surrounding form, not the component. Wrap each field in a container sized to its actual content rather than letting every field in a form stretch edge-to-edge: **~400px is a reasonable default** for a normal single-line field (name, label, a short free-text value), narrower (~160–200px) for something genuinely short like a numeric field, port, or short code, and full-width only when the content itself is long (a URL, a long free-text description). This is a general form-layout rule, not specific to any one field — apply it to every text field a prototype builds, not just ones being converted from something else. The same rule applies to `Select` and `Search`.

### Select

```ts
interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;                 // optional leading icon/flag
  disabled?: boolean;
}
interface SelectProps {
  options?: SelectOption[];
  value?: string | null;            // controlled; null = no selection
  defaultValue?: string | null;
  onChange?: (value: string | null, option: SelectOption | null) => void;
  placeholder?: string;
  label?: string;
  labelPosition?: "top" | "left";   // default "top"
  helperText?: string;
  errorText?: string;
  infoIcon?: boolean;
  infoText?: string;
  onInfoIconClick?: () => void;
  clearable?: boolean;              // default true
  disabled?: boolean;
  readOnly?: boolean;
  creatable?: boolean;              // default false
  onCreateOption?: (query: string) => void;
  emptyMessage?: string;            // default "No options available"
  id?: string;
  className?: string;
  "aria-label"?: string;
}
```

- Single-select only. There is no multi-select, no checkbox items, no grouped/categorized lists, no async loading. If a design needs those, that is a gap to flag (step 3 of "Components first") — do not fake it with `Select`.
- Controlled/uncontrolled like the other form fields: `value` + `onChange` for state you own, or `defaultValue` for a self-managed field. `onChange` receives the value and the full option (both `null` when cleared).
- Every `Select` is always type-to-filter (case-insensitive match on `label`); there is no prop to turn this off or on.
- No-match behavior: with `creatable={false}` (default) typing text that matches nothing shows `emptyMessage`. With `creatable` the dropdown shows a `Create "<query>"` row and fires `onCreateOption(query)` when chosen. **`Select` never changes its own `options`** — in `onCreateOption`, add the new option to your `options` state and set `value` yourself.
- Per-option `icon` is a plain `ReactNode` slot (use an Icon-pack icon or a flag element); no default. `disabled` options are skipped in keyboard navigation and cannot be chosen.
- `label`, `labelPosition`, `helperText`, `errorText`, `infoIcon`/`infoText`/`onInfoIconClick`, `clearable`, `disabled`, `readOnly` follow the same rules as `TextField` (omit `label` for an unlabeled field and pass `aria-label`; `errorText` also switches the field into its error state and hides `helperText`; `readOnly` and `disabled` are different visuals).
- Keyboard: ArrowUp/ArrowDown open and move the highlight, Enter selects, Escape closes. Built in — nothing to wire.
- Width: the component is `width: 100%` of its wrapper — size the wrapper per the TextField width rule (~400px default).

### Search

```ts
interface SearchProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;   // Enter with no suggestion highlighted
  placeholder?: string;                 // default "Search"
  helperText?: string;
  errorText?: string;
  disabled?: boolean;
  clearable?: boolean;                  // default true
  suggestions?: string[];
  onSelectSuggestion?: (suggestion: string) => void;
  noResultsMessage?: string;            // default "No items found"
  id?: string;
  className?: string;
  "aria-label"?: string;
}
```

- A standalone search input with a fixed leading search icon. Use it for any search-style box instead of `TextField` (which has no leading icon). It has **no `label` prop** (and no label position) — it is always unlabeled; give context via `placeholder` and `aria-label`. It has no `readOnly` state.
- `suggestions` is opt-in. Omit it (the default) for a plain search box that never shows a dropdown. Pass a `string[]` to enable the suggestions dropdown: Search filters it locally (case-insensitive substring match against what is typed) and shows it only once something has been typed. Pass `[]` (empty array) when your own query has run and found nothing, so `noResultsMessage` renders.
- Submitting: `onSearch` fires on Enter when no suggestion is highlighted. `onSelectSuggestion` fires when a suggestion is chosen. `onChange` fires on every keystroke — use it to compute `suggestions`.
- `errorText` shows an error message below the field and switches it into its red-border error state; `helperText` is the neutral guidance line.
- Width: the component is `width: 100%` of its wrapper — size the wrapper per the TextField width rule.

### RadioButton

```ts
interface RadioButtonProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: () => void;            // fires only when this radio becomes selected, no argument
  label?: string;
  size?: "small" | "large";         // default "large"
  disabled?: boolean;
  readOnly?: boolean;
  infoIcon?: boolean;
  infoText?: string;
  onInfoIconClick?: () => void;
  className?: string;
  // plus standard <input> props (name, value, required, etc.)
}
```

- **Group related radios with a shared `name`** (standard `<input>` prop, passed through) — that's what makes them mutually exclusive. This component does not manage group state itself; each `RadioButton` is independent.
- `onChange` takes no argument and only fires when this radio *becomes* selected — native radio behavior, clicking one never fires an event on its siblings. Don't expect a call with `false` when a different radio in the group gets selected instead.
- Same `size`/`disabled`/`readOnly`/`infoIcon` conventions as `Checkbox` — default `size="large"`, reserve `size="small"` for tables/dense lists only.

### TabsHorizontal

```ts
interface TabsHorizontalTab {
  id: string;
  label: string;
  icon?: ReactNode;                 // optional leading icon
  badge?: string;                   // optional trailing badge text
  disabled?: boolean;
}
interface TabsHorizontalProps {
  tabs?: TabsHorizontalTab[];
  size?: "small" | "large";         // default "large"
  selectedTabId?: string;
  defaultSelectedTabId?: string;
  onSelectTab?: (tabId: string) => void;
  moreLabel?: string;               // default "More tabs"
  "aria-label"?: string;
  className?: string;
}
```

- Renders tab **headers only** — there is no content-panel slot. Render the content for the active tab yourself, driven by `onSelectTab` (controlled: pass `selectedTabId` + `onSelectTab` and switch your content on the same state) — or use `defaultSelectedTabId` for a self-managed header when the content below does not depend on it.
- Data-driven: pass `tabs` as an array; omitting it renders demo placeholder tabs, so always pass real `tabs`. Each tab needs a unique `id`. Uncontrolled default selection is `defaultSelectedTabId`, else the first enabled tab.
- `icon` is a plain `ReactNode` slot (an Icon-pack icon, typically `size={16}`); there is no default icon. `badge` is a short string rendered with the library `Badge` in a fixed subtle ultramarine style — you cannot choose its color or type.
- Overflow is automatic: when tabs do not fit the available width, trailing tabs collapse into a "…" button that opens a menu of the remaining tabs. Not a prop, nothing to configure. Do not hand-build scrolling or truncation for tabs.
- `size="large"` is the default; `"small"` is the compact size. Keyboard support (arrow keys, Home/End) is built in.

### Table

```ts
type TableHeaderVariant = "filled" | "outlined";
type TableSortDirection = "asc" | "desc";
type TableCellType = "text" | "link" | "iconText" | "badge" | "actionIcons" | "actionMenu" | "custom";

interface TableRowData { id: string; [key: string]: unknown }
interface TableLinkValue { label: string; href?: string; onClick?: () => void; icon?: ReactNode }
interface TableIconTextValue { label: string; icon: ReactNode }
interface TableBadgeValue { label: string; type?: BadgeType; color?: BadgeColor }  // same values as Badge
interface TableAction<T extends TableRowData = TableRowData> {
  label: string;
  icon?: ReactNode;                 // required for 'actionIcons', optional for 'actionMenu'
  onClick: (row: T, rowIndex: number) => void;
  disabled?: boolean | ((row: T) => boolean);
}
interface TableColumn<T extends TableRowData = TableRowData> {
  key: string;
  header?: string;                  // omit for an icon-only/empty header
  headerIcon?: ReactNode;
  infoIcon?: boolean;
  infoText?: string;
  sortable?: boolean;
  width?: string;                   // CSS grid track, e.g. "160px"; omit for equal flexible share
  cellType?: TableCellType;
  accessor?: (row: T, rowIndex: number) => unknown;   // raw cell value per cellType
  render?: (row: T, rowIndex: number) => ReactNode;   // required for cellType "custom"
  actions?: TableAction<T>[];       // for 'actionIcons' / 'actionMenu'
}
interface TableProps<T extends TableRowData = TableRowData> {
  columns?: TableColumn<T>[];
  rows?: T[];
  headerVariant?: TableHeaderVariant;   // default "filled"
  zebra?: boolean;                      // default false
  bordered?: boolean;                   // default true
  selectable?: boolean;
  selectedRowIds?: string[];
  defaultSelectedRowIds?: string[];
  onSelectedRowIdsChange?: (ids: string[]) => void;
  expandable?: boolean;
  renderExpandedContent?: (row: T, rowIndex: number) => ReactNode;
  expandedRowIds?: string[];
  defaultExpandedRowIds?: string[];
  onExpandedRowIdsChange?: (ids: string[]) => void;
  sortColumnKey?: string;
  sortDirection?: TableSortDirection;
  onSortChange?: (columnKey: string, direction: TableSortDirection) => void;
  "aria-label"?: string;
  className?: string;
}
```

- Always pass both `columns` and `rows` — omitting them renders demo placeholder data. Every row needs a unique string `id`.
- Cell content is picked per column by `cellType` (default `"text"`) and read from the row with `accessor`: `text` → string; `link` → `TableLinkValue`; `iconText` → `TableIconTextValue` (an icon plus a label; use for status with a colored icon); `badge` → `TableBadgeValue`; `actionIcons` → bare icon buttons from `actions` (each needs `icon`); `actionMenu` → a "…" row menu built from `actions`. Anything else (a `Button`, `Checkbox` or `RadioButton` in a cell, a `Select`, a switch) goes through `cellType: "custom"` with `render`. There is no dedicated Select/Switch/Button cell type.
- A `text` cell whose value is `undefined`/`null`/`""` shows a placeholder-colored "No data" — do not pre-fill empty cells with dashes.
- **Sorting is fully controlled: `Table` never reorders `rows`.** `sortable: true` on a column makes its header clickable; `onSortChange(columnKey, direction)` fires and **you** re-sort your `rows` array and pass it back, along with `sortColumnKey`/`sortDirection` so the header shows the active state.
- `selectable` adds a checkbox (and a select-all checkbox in the header) to the first column; `expandable` adds an expand caret to the first column and renders `renderExpandedContent(row)` below the row. Both are controlled/uncontrolled like other fields (`selectedRowIds`/`defaultSelectedRowIds`, `expandedRowIds`/`defaultExpandedRowIds`). The built-in checkboxes are already `size="small"`.
- **`zebra` is ignored whenever `expandable` is true** (rows always use the default background) — do not combine them expecting stripes.
- Column sizing: columns share the row equally by default; set `width` to pin one. A column with no `header` text gets a fixed narrow width, and `actionIcons`/`actionMenu` columns size to their content — they never stretch. Omit `header` entirely for an icon-only column rather than passing an empty string.
- Row actions: all items in an `actionMenu`/`actionIcons` render in the same default style; there is no destructive/danger styling for an action.
- Nested table: render a second `Table` inside `renderExpandedContent` with `bordered={false}` and leave its `headerVariant` at the default `"filled"`.
- Header variants: `"filled"` (grey header, default) or `"outlined"`. There is no `"nested"` variant.
- Scope: a table only. There is no built-in pagination, toolbar, search or empty-whole-table state — compose those around it with other library components.
- Do not wrap a `Table` in a `Container` (see Container).

### Drawer

```ts
type DrawerSize = "default" | "small" | "flexible";
interface DrawerProps {
  open: boolean;                    // required, controlled
  onClose: () => void;              // required
  title?: string;                   // default "Header title"
  icon?: ReactNode;                 // optional leading icon before the title
  size?: DrawerSize;                // default "default"
  footer?: ReactNode;               // sticky footer slot
  overlay?: boolean;                // default true
  closeOnOverlayClick?: boolean;    // default true
  closeOnEsc?: boolean;             // default true
  children?: ReactNode;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}
```

- A right-hand slide-in panel. Visibility is fully controlled: keep an `open` boolean in state, set it `true` from a trigger (e.g. a `Button`) and `false` in `onClose`. `onClose` fires for the close icon, Esc and overlay click — all handled by the component.
- Right side only: there is no `position` prop (no left/top/bottom drawers).
- Always pass a real `title` — the default is the placeholder "Header title". Sizes: `"default"` 480px, `"small"` 300px, `"flexible"` min 300px and up to 90vw (default width 600px).
- `footer` is a plain slot for action buttons — compose it with library `Button`s (Figma's spec allows up to 3: typically a `link` and a `secondary` Cancel plus a `primary` CTA, right-aligned). The footer is pinned below the scrolling content. For long content that scrolls, put actions in `footer` to keep them visible, or place them at the end of `children` if they should scroll with the content.
- `children` scroll automatically when taller than the panel; do not add your own scroll container.
- Focus is trapped inside the open drawer and the page behind is scroll-locked; focus returns to the previously focused element on close. Built in.
- `icon` is a plain `ReactNode` slot (an Icon-pack icon); there is no default icon.
- Do not use `Drawer` for a centered modal dialog — no modal component exists in this version (flag it).

### Icon pack

- One React component per icon, exported from this package by name. All accept `size?: number` plus standard SVG props. Only these icons exist — do not hand-draw a new icon inline.
- Default size 24px: `ComputeIcon`, `BucketIcon`, `NetworkIcon`, `ServerIcon`, `MonitorIcon`, `UserIcon`, `MoreIcon`, `MenuIcon`, `SearchIcon`, `HelpCircleIcon`, `CommunityIcon`, `BellIcon`.
- Default size 20px: `InfoIcon`, `EditIcon`, `DownloadIcon`, `DeleteIcon`, `CaretIcon`, `StatusAlertIcon`.
- Default size 16px: `ChevronUpIcon`, `ChevronDownIcon`, `PinIcon` (extra prop `filled?: boolean`), `PlusIcon`, `CloseIcon`, `SortIcon`, `ArrowLeftIcon`, `SpinnerIcon` (extra prop `variant?: "white" | "gradient"`, default `"white"`).
- Default size 12px: `CheckIcon`, `MinusIcon`, `DotIcon`.
- Icons render in `currentColor` — color them by setting the text color of a parent, never with a raw color on the icon.
- When composing a new `SideNavSection`, pass an icon element directly as the `icon` field, e.g. `icon: <ComputeIcon />`. A section that needs an icon not in the pack needs a new exact-vector icon pulled from Figma, not an approximation (see the SideNavigation section above).

## Composition examples

**Basic page (defaults cover almost every case) — use `DefaultCmPageTemplate`, which supplies header, side navigation and footer:**

```tsx
import { Container, DefaultCmPageTemplate } from "figma-make-bridge";

export default function Page() {
  return (
    <DefaultCmPageTemplate>
      <h1 className="type-heading-xxl" style={{ margin: 0 }}>Page title</h1>
      <div style={{ marginTop: "var(--global-spacing-s16)" }}>
        <Container>
          <p className="type-body-regular" style={{ margin: 0 }}>Page content</p>
        </Container>
      </div>
    </DefaultCmPageTemplate>
  );
}
```

**Real multi-page navigation (selection controlled, wired to the content that is shown):**

```tsx
import { useState } from "react";
import { DefaultCmPageTemplate } from "figma-make-bridge";

export default function App() {
  const [pageId, setPageId] = useState("linodes");
  return (
    <DefaultCmPageTemplate sideNavProps={{ selectedPageId: pageId, onSelectPage: (id) => setPageId(id) }}>
      <h1 className="type-heading-xxl" style={{ margin: 0 }}>{pageId}</h1>
    </DefaultCmPageTemplate>
  );
}
```

**Adding a product to an existing section, with a badge:**

```tsx
import { DEFAULT_SIDE_NAV_SECTIONS, DefaultCmPageTemplate, type SideNavSection } from "figma-make-bridge";

const sections: SideNavSection[] = DEFAULT_SIDE_NAV_SECTIONS.map((section) =>
  section.id === "compute"
    ? {
        ...section,
        pages: [...section.pages, { id: "gpu-instances", label: "GPU Instances", badge: { type: "new" } }],
      }
    : section
);

export default function Page() {
  return <DefaultCmPageTemplate sideNavProps={{ sections }}>{/* page content */}</DefaultCmPageTemplate>;
}
```

**Frozen rail for an isolated preview (narrow escape hatch, not the default):**

```tsx
import { SideNavigation } from "figma-make-bridge";

<SideNavigation menu="mini" />;
```

**Controlled Table with sorting (the consumer sorts the rows):**

```tsx
import { useState } from "react";
import { Table, type TableColumn, type TableRowData, type TableSortDirection } from "figma-make-bridge";

const columns: TableColumn[] = [
  { key: "name", header: "Name", sortable: true, accessor: (row) => row.name },
  { key: "region", header: "Region", accessor: (row) => row.region },
];

export default function Instances({ data }: { data: TableRowData[] }) {
  const [sort, setSort] = useState<{ key: string; dir: TableSortDirection }>({ key: "name", dir: "asc" });
  const rows = [...data].sort((a, b) =>
    String(a[sort.key]).localeCompare(String(b[sort.key])) * (sort.dir === "asc" ? 1 : -1)
  );
  return (
    <Table
      columns={columns}
      rows={rows}
      sortColumnKey={sort.key}
      sortDirection={sort.dir}
      onSortChange={(key, dir) => setSort({ key, dir })}
    />
  );
}
```

**Drawer opened from a Button:**

```tsx
import { useState } from "react";
import { Button, Drawer } from "figma-make-bridge";

export default function EditPanel() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Edit</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Edit instance"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>Save</Button>
          </>
        }
      >
        <p className="type-body-regular">Drawer content</p>
      </Drawer>
    </>
  );
}
```

## Known constraints / things not to attempt

- Never render page content wider than `DefaultCmPageTemplate`'s content slot (`max-width: 1280px`, centered). Everything placed in the `children` slot must stay inside that width — don't break out of it with a wider element or negative margins. Don't add your own centering, max-width or outer padding around page content.
- Import every component statically. Do not wrap any import from this package in a dynamic `import()` — Figma Make's bundler does not support it.
- Do not wrap these components in app-shell dependencies (routing providers, app-specific context) — none is required, and adding one is not solving a real constraint.
- Do not add a `theme` prop to any component, and do not pass raw hex/rgb/named colors or `style`/`className` color overrides to a library component. This version is light-theme only; customization of a library component is a token-file concern, never a prop. Custom UI follows the token rules in "Design tokens" (alias variables, `--global-color-*` only as a mentioned last resort).
- Do not invent variants, props, or states on any library component; if one is missing, build per "Components first" and say so.
- GlobalHeader: do not add a `type`/`variant` prop to pick a responsive layout — breakpoints are automatic CSS, not a prop surface.
- GlobalFooter: no per-link icons or other link props beyond `id`/`label`/`href`/`target`.
- DefaultCmPageTemplate: do not nest a second header, side navigation or footer inside it, and do not wrap it in a scroll container. The side navigation is hidden below 960px.
- Badge: `color` is one of `ultramarine`/`purple`/`pink`/`neutral`/`amber`/`green`/`red` only — never the semantic words (`positive`, `negative`, …); `icon` is a boolean dot, not an icon slot.
- SystemBadge: do not add a label-override prop or a third state beyond `"new"`/`"beta"`.
- SideNavigation: do not invent a badge type beyond `"new"`/`"beta"`; do not add a brand-new section without a real icon (flag it instead, see SideNavigation above); reach for `menu="full"|"mini"` only as a narrow escape hatch, not the default way to render the rail.
- Layout rule for any row with a trailing element that should sit immediately after a label with a gap (a badge, chevron, or icon): never give the label `flex-1`. That stretches the label to fill all remaining space and pushes the trailing element to the row's far edge instead of leaving a clean gap next to the label. Let the label size to content and rely on the row's `gap`.
- Container: never place two `Container`s side by side in a row or give one an explicit width — it always fills its parent's full width by design. Do not put a `Table` inside one.
- Checkbox: default `size` is `"large"`; reach for `size="small"` only inside tables or dense list rows where space is constrained, never as a general/base default.
- TextField / Select / Search: all fill their wrapper's width — size the wrapper (~400px default), don't let them stretch edge-to-edge. TextField has no leading icon (use `Search`); Search has no label; Select is single-select only.
- TabsHorizontal: headers only — render the tab content yourself. Do not hand-build tab overflow.
- Table: sorting is controlled (you sort the rows); `zebra` is ignored with `expandable`; no pagination/toolbar; no `"nested"` header variant; no danger styling on actions; never inside a `Container`.
- Drawer: right side only, controlled `open`/`onClose`; no modal dialog component exists, so a centered modal is a gap to flag.
- No Tooltip, Modal, Switch, Dropdown (multi-select/grouped), Notification/Toast, Topbar/Breadcrumb or Pagination component exists in this version. `infoIcon` on form fields is a placeholder for a future Tooltip and only shows the browser's native `title` text.
- Dark theme is not available in this version. Do not attempt to build a dark mode or theme switch.
