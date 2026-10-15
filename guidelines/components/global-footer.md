# GlobalFooter

Bottom bar with a link list and a copyright line.

## When to use / when not to use

- In a full page, do NOT render it. Pass `footerProps` to `DefaultCmPageTemplate` (see composition/page-shell.md).
- Render it directly only for an isolated preview.
- Default usage: `<GlobalFooter />` with no props.

## Import

```tsx
import { GlobalFooter, type GlobalFooterProps, type GlobalFooterLink } from "figma-make-bridge";
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `links` | `GlobalFooterLink[]` | version label, "API Reference", "Provide Feedback" (all `href="#"`) | Replaces the whole list |
| `copyrightText` | `string` | `© {current year} Akamai Technologies, Inc. All Rights Reserved` | Replaces the full string |
| `className` | `string` | none | Replaces ALL default styling |

`GlobalFooterLink`:

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | Required, unique |
| `label` | `string` | Required |
| `href` | `string` | Required |
| `target` | `string` | Optional. `"_blank"` adds `rel="noopener noreferrer"` automatically |

## Valid values

- Link fields: only `id`, `label`, `href`, `target`.
- Invalid or non-existent link fields: `icon`, `onClick`, `variant`, `external`.
- Invalid or non-existent props: `variant`, `type`, `columns`, `logo`.

## Correct

```tsx
<GlobalFooter links={[{ id: "docs", label: "Docs", href: "#", target: "_blank" }]} />
```

## Incorrect

```tsx
<GlobalFooter links={[{ label: "Docs", href: "#", icon: <InfoIcon /> }]} />
```

Missing `id`, and `icon` does not exist.

## Known footguns

- Pass `links` only to replace the whole list. Each link needs a unique `id`.
- Omit `copyrightText` to keep the dynamic-year default.
- Layout is responsive by CSS: stacked column below 960px, single row at 960px+. It is not a prop.
- Never pass `className`. It replaces the default classes and strips the footer styling.
- Never nest a second `GlobalFooter` inside `DefaultCmPageTemplate`.
