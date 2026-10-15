# Badge

General-purpose status or category label: a fixed 20px-tall single-line pill.

## When to use / when not to use

- Use for status or category labels in tables, headers and tabs.
- Do NOT use it for the fixed NEW/BETA marker next to a navigation label. Use `SystemBadge` (components/system-badge.md).
- Do NOT put it in a `SideNavigation` row.

## Import

```tsx
import { Badge, type BadgeProps, type BadgeType, type BadgeColor } from "@make-kits/ads-components";
```

## Props

| Prop | Type | Default | Allowed values |
|---|---|---|---|
| `type` | `BadgeType` | `"subtle"` | `"subtle"`, `"accent"` |
| `color` | `BadgeColor` | `"ultramarine"` | `"ultramarine"`, `"purple"`, `"pink"`, `"neutral"`, `"amber"`, `"green"`, `"red"` |
| `icon` | `boolean` | `false` | `true`, `false` |
| `label` | `string` | `"Badge"` | any short string |
| `className` | `string` | none | |

## Valid values

- `type="subtle"`: light tinted badge.
- `type="accent"`: solid-color badge with white text.
- `color`: exactly the 7 values above. They are the design's literal color names.

Invalid values (render an unstyled badge):

- `color`: `"positive"`, `"negative"`, `"warning"`, `"informative"`, `"important"`, `"blue"`, `"yellow"`, `"gray"`.
- `type`: `"outline"`, `"solid"`, `"filled"`.
- `icon`: any icon element. It is a boolean.

Map meaning to color yourself: `green` success, `red` error, `amber` warning, `ultramarine` informative.

## Correct

```tsx
<Badge type="accent" color="green" label="Running" icon />
```

## Incorrect

```tsx
<Badge color="positive" icon={<CheckIcon />} label="Running" />
```

## Known footguns

- `icon` shows a small leading dot in the badge's text color. You cannot swap in a different icon.
- Keep `label` short. The badge does not wrap.
- Inside `Table`, use `cellType: "badge"` with a `TableBadgeValue` instead of rendering `Badge` yourself (components/table.md).
