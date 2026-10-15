# SystemBadge

Fixed NEW or BETA marker shown inline next to a label.

## When to use / when not to use

- Use for navigation rows. Set `badge` on the `SideNavPage` data instead of rendering `<SystemBadge>` yourself (components/side-navigation.md).
- For any other status or label badge, use `Badge` (components/badge.md).

## Import

```tsx
import { SystemBadge, type SystemBadgeProps } from "@make-kits/ads-components";
```

## Props

| Prop | Type | Default | Allowed values |
|---|---|---|---|
| `type` | `"beta" \| "new"` | none (required) | `"new"`, `"beta"` |
| `className` | `string` | none | Replaces ALL default styling |

## Valid values

- `"new"` renders violet "NEW".
- `"beta"` renders grey "BETA".
- Invalid or non-existent: any third type (`"alpha"`, `"deprecated"`, `"preview"`), `label`, `color`, `children`.

## Correct

```tsx
<SystemBadge type="beta" />
```

## Incorrect

```tsx
<SystemBadge type="alpha" label="Alpha" />
```

## Known footguns

- Content is fixed. There is no label-override prop and none should be added. There is no free-text variant.
- Never pass `className`. It replaces the default classes and strips the badge styling.
