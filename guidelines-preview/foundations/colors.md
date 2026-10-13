# Colors

Read this before writing ANY custom color. It applies only to custom UI (Components-first step 3). Library components carry their own tokens.

## Rules

- IMPORTANT: Colors use alias variables: `var(--alias-...)`.
- IMPORTANT: `--global-color-*` is a rare last resort, allowed only when no alias variable fits. If you use one, mention it in the reply (which variable, why no alias fit).
- IMPORTANT: Never use a raw hex, `rgb()`, `rgba()`, `hsl()` or a named color (`white`, `red`, ...) anywhere.
- The package exposes three tiers as CSS custom properties: `--global-*` (primitives: palette, spacing), `--alias-*` (semantic colors and elevation), `--component-*` (per-component values). Font primitives are `--font-*` and `--line-height-*`.
- Library components already use their own `--component-*` variables. Never reference `--component-*` in app code. Never pass color overrides to a library component. Per-instance customization is not possible.
- Only the variable names in this file exist. Do not invent `--alias-*` names.
- Spacing and text are exempt from this tier rule (see foundations/spacing.md and foundations/typography.md).

## Decision tree

1. Is there a library component for this UI? Use it. Stop. No custom color needed.
2. Composing from library components? Style only layout. Stop.
3. Custom element needed? Pick the alias variable from the tables below by role (text, icon, border, background, action, interaction, accent).
4. No alias fits? Use `--global-color-*` as a rare last resort, and mention it in the reply.
5. Never fall through to hex, rgb, hsl or named colors.

## Alias reference

Variable name = `--alias-` + path, lowercase, no separators inside a word (camelCase keys become lowercase, e.g. `primaryhover`). "No description" means the source gives no usage note. The guidance there is derived from the name only.

**Text** `--alias-content-text-<name>`

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
| `warning`, `positive`, `informative` | No description: status-colored text by name |

**Icon** `--alias-content-icon-<name>`

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

**Border** `--alias-border-<name>`

| Name | Use |
|---|---|
| `normal` | Border for static UI elements and components |
| `neutral` | No description: neutral border by name |
| `negative` | Only for borders indicating an error state |
| `warning` | Only for borders indicating a warning state |
| `positive` | Only for borders indicating a success state |
| `informative` | Only for borders indicating an info state |
| `recommendation` | Only for borders indicating a recommendation state |

**Background** `--alias-background-<name>`

| Name | Use |
|---|---|
| `normal` | Primary background color |
| `neutral` | Page background color |
| `base` | Tooltip background |
| `black` | Only for a global header and global footer background |
| `overlay` | Page dimming when a modal component is active |
| `negative`, `warning`, `positive`, `informative` | No description: solid status backgrounds by name |
| `negativesubtle`, `warningsubtle`, `positivesubtle`, `informativesubtle`, `recommendationsubtle`, `neutralsubtle` | No description: subtle (light tint) status backgrounds by name |

**Action** `--alias-action-<name>` (fills for actionable surfaces; library `Button` already uses these)

| Name | Use |
|---|---|
| `primary-default` | Brand action color |
| `white50` | Transparent disabled switcher circle |
| `base`, `neutral` | No description: base/neutral action fills by name |
| `primary-hover`, `primary-active`, `primary-disabled` | No description: primary action states by name |
| `secondary-hover`, `secondary-disabled` | No description: secondary action states by name |
| `tertiary-default`, `tertiary-disabled` | No description: tertiary action states by name |
| `positive-default`, `positive-hover`, `positive-active`, `positive-disabled` | No description: positive (success) action states by name |
| `negative-default`, `negative-hover`, `negative-active`, `negative-disabled` | No description: negative (destructive) action states by name |

**Interaction** `--alias-interaction-<group>-<name>` (field and surface states)

| Name | Use |
|---|---|
| `border-default` | Default inputs border |
| `border-hover`, `border-focus`, `border-error`, `border-disabled`, `border-light` | No description: input border states by name |
| `background-primary` | Default component background color |
| `background-primaryhover` | Calendar range background, table row hover |
| `background-primaryactive` | Active/selected backgrounds |
| `background-secondaryhover` | Hover color for a calendar date range |
| `background-secondary`, `background-secondaryactive`, `background-tertiary`, `background-tertiaryhover`, `background-tertiaryactive`, `background-neutral`, `background-neutralhover`, `background-neutralactive`, `background-disabled` | No description: background states by name |

**Accent** `--alias-accent-<hue>-primary` and `--alias-accent-<hue>-secondary`. No descriptions in the source. By name and value: `primary` is the solid color, `secondary` is a 12% translucent tint of the same hue. Hues: `info`, `neutral`, `warning`, `negative`, `positive`, `important`, `recommendation`, `pink`, `violet`. Also `--alias-accent-disabled`.

**Elevation** `--alias-elevation-<name>` (box-shadow values: use with `box-shadow`, never as a color)

| Name | Use |
|---|---|
| `s` | Default shadow for components like notification banners, dropdowns, popups |
| `s-inverted` | Inverted shadow for elements that appear above the component |
| `l` | Shadow for modals |
| `drawer-right`, `drawer-left`, `drawer-top`, `drawer-bottom` | Drawer elevation by the side the drawer appears from |

**Chart** (no descriptions in the source; by name only). Use for data visualization, not general UI.

- `--alias-chart-neutral`
- `--alias-chart-categorical-<1..22>-primary` / `-inactive` / `-transparent` (one series color per number; `inactive` and `transparent` are lighter/translucent variants of that series color)
- `--alias-chart-monochromatic-default-<5|10|20|30|40|50|60|70|90|100>` and `--alias-chart-monochromatic-danger-<5|10|20|30|40|50|60|70|90|100>` (light-to-dark ramps)
- `--alias-chart-status-negative`, `--alias-chart-status-warning`, `--alias-chart-status-positive`

## Examples

Correct (custom callout, step 3 only):

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

Incorrect:

```tsx
<div style={{ background: "white", color: "red", border: "1px solid rgb(0, 0, 0)" }}>
  Named and rgb colors are never allowed.
</div>
<div style={{ color: "var(--component-button-primary-default-text)" }}>
  Never reference --component-* in app code.
</div>
<div style={{ color: "var(--alias-content-text-brand)" }}>
  This alias name does not exist.
</div>
```
