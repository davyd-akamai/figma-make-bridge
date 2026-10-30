# Token Sources

Figma file: Internal ADS library (`BP7Y1Gc9sz2HLrcXFHMFhg`). Figma is the source of truth: if a JSON file and Figma disagree, Figma is correct and the JSON is fixed.

Node IDs below are taken from the header comments of the matching component in `components/`. Variable-level verification is only recorded where stated.

| Token file | Figma source (node) | Status |
|---|---|---|
| `badge.json` | `Badge` (76:4205) | node from component header; variables not re-verified |
| `breadcrumb.json` | `Breadcrumbs` (123:4284), `.breadcrumb-item` (123:4208) | node from component header; variables not re-verified |
| `button.json` | `Button` (47:14865) | node from component header; variables not re-verified |
| `checkbox.json` | `core_checkbox` (58:4716), `.base-checkbox` (58:4359) | node from component header; variables not re-verified |
| `container.json` | `Container` (58:5033) | node from component header; variables not re-verified |
| `contentPanel.json` | `Content panel` (126:4081) | variables checked via get_variable_defs (background/border/icon matched); pre-seeded, `divider` added additively |
| `drawer.json` | `Drawer` (47:8675) | node from component header; variables not re-verified |
| `dropdown.json` | `Dropdown` (77:4363), used by Select | node from Select header; variables not re-verified |
| `footer.json` | `cm_footer` (1:926) | node from component header; variables not re-verified |
| `header.json` | `cm_header` (1:882) | node from component header; variables not re-verified |
| `modal.json` | `Modal` (123:4666) | variables checked via get_variable_defs; overlay/elevation added additively |
| `menuButton.json` | no component in this repo cites a node | source unknown; to be confirmed in Figma |
| `notificationBanner.json` | `Notification banner` (123:5210) | variable colors cross-checked against the exported icon/frame fills (all matched); pre-seeded, used as-is |
| `notificationToast.json` | `Notification toast` (123:5295) | variables checked via get_variable_defs (all matched); pre-seeded, `elevation.s` added additively |
| `pagination.json` | `Pagination` (128:4563) | variables checked via get_variable_defs (all matched); pre-seeded, `divider.border` added additively |
| `progressBar.json` | `Progress bar` (150:7570) | variables checked via get_variable_defs (statusLine default/success/error, text default/link and the gradient, brand `#009CDE` end, all matched); pre-seeded, used as-is (`text.link.hover` has no Figma swatch, kept as pre-seeded) |
| `numericSpinner.json` | `Numeric spinner` (158:8448) | variables checked via get_variable_defs (all matched); pre-seeded, `label`/`labelInfoIcon` added additively (hover text/icon not in Figma, kept as pre-seeded) |
| `radioButton.json` | `Radio-button` (58:5044) | node from component header; variables not re-verified |
| `search.json` | `Search-field` (91:3834) | node from component header; variables not re-verified |
| `select.json` | `Select` (47:7683) | node from component header; variables not re-verified |
| `sideNavigation.json` | `cm_side-navigation` (17:2719) | **global tokens only, verified against 17:2719** |
| `switch.json` | `Switch` (129:5474), `.base-switch` (129:5136) | variables checked via get_variable_defs (all matched); pre-seeded, `elevation.s` added additively |
| `systemBadge.json` | `cm_global-badge` (29:3416) | node from component header; variables not re-verified |
| `tooltip.json` | `Tooltip` (149:6624) | variables checked via get_variable_defs (background `#343438`, text `#FFFFFF` matched); pre-seeded, used as-is |
| `tag.json` | `Tag item` (140:6272) | variables checked via get_variable_defs (all matched); pre-seeded, used as-is (`readOnly.background` unused: Figma's read-only tag has no fill) |
| `tagInput.json` | `Tag input` (140:8688) | variables checked via get_variable_defs (all matched); pre-seeded, `label`/`labelInfoIcon` added additively |
| `table.json` | `core_table-column` (47:4956) | node from component header; variables not re-verified |
| `tabs.json` | `Tabs-horizontal` (74:5959) | node from component header; variables not re-verified |
| `textArea.json` | `Text area` (140:6170) | created from `textField.json`'s identical alias shape; every hex checked against get_variable_defs on 140:6170 (all matched); `resizeIcon` added |
| `textField.json` | `core_text-field` (47:7385) | node from component header; variables not re-verified |

`global.json`, `light.json` and `dark.json` are the primitive and theme-alias layers, not component sources.
