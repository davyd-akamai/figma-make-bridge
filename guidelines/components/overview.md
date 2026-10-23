# Component overview

Read this file before using any component. Then read the file for that component.

## Components

| Component | Use for | File |
|---|---|---|
| GlobalHeader | Top product bar: logo, search, create, account | components/global-header.md |
| GlobalFooter | Bottom bar: links and copyright | components/global-footer.md |
| SideNavigation | Left product navigation rail | components/side-navigation.md |
| DefaultCmPageTemplate | Page shell: header + rail + footer around content | composition/page-shell.md |
| Badge | Status or category label | components/badge.md |
| SystemBadge | Fixed NEW/BETA marker next to a nav label | components/system-badge.md |
| Button | Every button and action | components/button.md |
| Container | Bordered surface that groups content | components/container.md |
| ContentPanel | Titled, collapsible section with header actions and a body | components/content-panel.md |
| Checkbox | On/off choice, select-all | components/checkbox.md |
| RadioButton | One choice from a group | components/radio-button.md |
| TextField | Single-line text input | components/text-field.md |
| Select | Single-select dropdown | components/select.md |
| Search | Search box with optional suggestions | components/search.md |
| Breadcrumbs | Location trail with optional inline rename of the current page | components/breadcrumbs.md |
| TabsHorizontal | Tab headers (no panels) | components/tabs-horizontal.md |
| Table | Data table with sort, select, expand | components/table.md |
| Pagination | Page-size picker, range and prev/next under a table or list; selection bar for lists | components/pagination.md |
| Drawer | Right-hand slide-in panel | components/drawer.md |
| Modal | Centered confirmation/dialog box | components/modal.md |
| NotificationBanner | Inline status message with optional action and dismiss | components/notification-banner.md |
| Toast | Floating bottom-right notification, auto-dismisses after 5s | components/toast.md |

Icons: foundations/icons.md.

## Which component for which job

- Full screen -> `DefaultCmPageTemplate`.
- Group related content on a page -> `Container`, stacked vertically.
- A titled section that can collapse, with header icon actions -> `ContentPanel`.
- Any clickable action -> `Button`.
- Status or category label -> `Badge`.
- NEW/BETA next to a nav label -> `SystemBadge` (set via `SideNavPage.badge`).
- Free text input -> `TextField`.
- Search-style input -> `Search`.
- Pick one value from a list -> `Select`.
- Pick one option from a visible group -> `RadioButton`.
- Toggle or multi-pick -> `Checkbox`.
- Show where the user is in a hierarchy -> `Breadcrumbs`.
- Switch between views -> `TabsHorizontal` + your own content.
- Rows of data -> `Table`.
- Paging through a large `Table` or list -> `Pagination`.
- Edit or detail panel -> `Drawer`.
- Short confirmation or blocking question -> `Modal`.
- Inline status message inside a page (info, warning, success, error) -> `NotificationBanner`.
- Brief floating feedback after an action (auto-dismisses) -> `Toast`.

## Components that do NOT exist yet

Never invent these. If you are tempted to, say so in the reply before building custom UI, then follow the token order in Guidelines.md.

| Missing | Also forbidden as a name or import |
|---|---|
| Tooltip | `Tooltip`, `Popover` as a public component |
| Switch | `Switch`, `Toggle` |
| Dropdown (multi-select, grouped) | `Dropdown`, `DropdownMenu`, `MultiSelect`, `Combobox` |
| Toast stack / queue / `toast.open()` service | `ToastContainer`, `ToastProvider`, `useToast`, `Snackbar` |
| Topbar | `Topbar` |
| Pagination | `Pagination`, `Pager` |
| Menu button | `MenuButton`. Not available. Use `Button` plus custom UI and announce it. |

Also not available: a mobile navigation drawer, tab content panels, a table toolbar.

## Rules for all components

- Do not invent variants, props or states. No extra `variant` values, no new props, no `theme`.
- Do not hand-build what a library component already does: buttons, inputs, selects, tabs, tables, drawers, badges, headers, footers.
- Never pass raw colors, or `style`/`className` color overrides, to a library component. Customization is never a prop.
- `infoIcon` on form fields is a placeholder for a future Tooltip. It shows only the browser's native `title` text.
- Form field width: `TextField`, `Select` and `Search` fill 100% of their wrapper. Size the wrapper. Do not let them stretch edge-to-edge.
  - About 400px for a normal single-line field (name, label, short free text).
  - About 160-200px for something short (number, port, short code).
  - Full width only when the content is long (URL, long description).
  - Apply this to every field a prototype builds.
