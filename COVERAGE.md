# Component Coverage

Tracks which Akamai CDS (`core-design-system`, `@akamai/cds-components`) components exist in `figma-make-bridge`, and which ones we plan to build. CDS is reference only (see [GUIDELINES.md](GUIDELINES.md)); this doc is the scoped to-do view, not a full CDS inventory — CDS components we have no plan to build are intentionally left out.

_Last updated: 2026-10-30. Source: local `core-design-system/packages/cds-components/src/components/` vs. `components/`._

## Built

| CDS component | Bridge component | Code Connect | Notes |
|---|---|---|---|
| badge | [Badge](components/Badge.tsx) |  |  |
| breadcrumb | [Breadcrumbs](components/Breadcrumbs.tsx) |  |  |
| button | [Button](components/Button.tsx) | ✓ | Tertiary / Launch / icon variants held back until Figma has swatches |
| checkbox | [Checkbox](components/Checkbox.tsx) | ✓ |  |
| content-panel | [ContentPanel](components/ContentPanel.tsx) |  | Single panel only; no `content-panel-group`, no `stripe` |
| drawer | [Drawer](components/Drawer.tsx) |  | Right side only |
| icon | [Icons](components/icons/index.tsx) | Partial | 44 exact-vector icons |
| modal | [Modal](components/Modal.tsx) | ✓ |  |
| notification-banner | [NotificationBanner](components/NotificationBanner.tsx) | ✓ |  |
| notification-toast | [Toast](components/Toast.tsx) | ✓ |  |
| numeric-spinner | [NumericSpinner](components/NumericSpinner.tsx) | ✓ | Single number; min/max/step, hold-to-repeat chevrons; behavior from CDS (Figma has static swatches only) |
| pagination | [Pagination](components/Pagination.tsx) | ✓ | `table`/`list` variants plus opt-in list selection mode; no numbered pages |
| radio-button | [RadioButton](components/RadioButton.tsx) | ✓ | No `RadioGroup` wrapper (deliberate) |
| search-field | [Search](components/Search.tsx) |  |  |
| select | [Select](components/Select.tsx) |  |  |
| side-nav | [SideNavigation](components/SideNavigation.tsx) |  |  |
| switch | [Switch](components/Switch.tsx) | ✓ | No read-only state |
| table | [Table](components/Table.tsx) |  |  |
| tabs | [TabsHorizontal](components/TabsHorizontal.tsx) | ✓ | No content panels |
| tag-input | [TagInput](components/TagInput.tsx), [Tag](components/Tag.tsx) | ✓ | `options` + `creatable`; per-tag `invalid`; wraps, scrolls at 100px (no "+N" collapse, no drag-reorder) |
| text-area | [TextArea](components/TextArea.tsx) | ✓ | Native vertical resize with Figma's handle overlaid |
| text-field | [TextField](components/TextField.tsx) | ✓ |  |
| tooltip | [Tooltip](components/Tooltip.tsx) | ✓ | Wraps its trigger; hover/focus, flips to fit; `arrow={false}` is Figma's "None"; no show-on-overflow-only mode |

Bridge-only (no CDS equivalent, built from Figma; Container is Code Connect ✓): Container, GlobalHeader, GlobalFooter, SystemBadge, DefaultCmPageTemplate.

## Planned

| Group | CDS component | Status |
|---|---|---|
| Date and time | calendar | Not started |
| Date and time | date-field | Not started |
| Date and time | date-picker | Not started |
| Date and time | date-range | Not started |
| Date and time | date-range-field | Not started |
| Feedback and overlay | progress-bar | Not started |
| Feedback and overlay | zero-error-state | Not started |

## Partial / internal

| CDS component | Current state |
|---|---|
| loading-spinner | Only `SpinnerIcon`, no standalone component |
| menu | Only the table `actionMenu` cell type |
| popover | Internal-only ([components/internal/Popover.tsx](components/internal/Popover.tsx)) |

## Open items

- **Topbar** — Figma-only (not in CDS); roadmap item 3b in GUIDELINES.md, Figma node still unidentified.
- Several planned items (the date components) depend on each other — e.g. date-picker builds on calendar and date-field — so build order matters.
