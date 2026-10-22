# Breadcrumbs

Location trail from the root to the current page. The last item is the current page; every earlier item is clickable and followed by a "/" separator.

## When to use

- A product landing page (for example the Firewalls list) has NO breadcrumb. It shows a page title (for example "Firewalls"), the main call to action, and the page content (usually a table).
- A detail page below a landing page has a breadcrumb and NO separate page title. The breadcrumb replaces the title.
- The first breadcrumb item is the product name (for example "Firewalls"). It links back to the landing page.
- The last breadcrumb item is the name of the current resource (for example the firewall name). It is not a link.
- Intermediate levels, if any, appear between them in order.
- Never show a breadcrumb and a page title together on the same page.
- Example: clicking a firewall in the Firewalls table opens its details page. The header is `Firewalls / my-firewall-01`.

## When to use / when not to use

- Use at the top of a page content area to show hierarchy and let users go back up.
- Optionally let users rename the current page inline (`editable`).
- Do not use it for switching views (use `TabsHorizontal`) or for primary navigation (use `SideNavigation`).
- Do not hand-build the trail or the "/" separators.

## Import

```tsx
import { Breadcrumbs, DEFAULT_BREADCRUMBS_ITEMS, type BreadcrumbsProps, type BreadcrumbsItem } from "figma-make-bridge";
```

## Props

| Prop | Type | Default | Allowed values |
|---|---|---|---|
| `items` | `BreadcrumbsItem[]` | `DEFAULT_BREADCRUMBS_ITEMS` (demo placeholders) | Always pass real `items` |
| `onNavigate` | `(item: BreadcrumbsItem, index: number) => void` | none | |
| `editable` | `boolean` | `false` | |
| `onRename` | `(title: string) => void` | none | |
| `aria-label` | `string` | `"Breadcrumb"` | |
| `className` | `string` | none | |

`BreadcrumbsItem`: `{ id?: string; label: string; href?: string; onClick?: () => void; badge?: "beta" | "new" }`.

## Valid values

- `badge`: `"beta"`, `"new"`. Fixed marker, no custom text or color.
- Invalid or non-existent: `separator`, `variant`, `size`, `maxItems`, `collapsible`, `children`, `icon`.

## Correct

```tsx
const [trail, setTrail] = useState<BreadcrumbsItem[]>([
  { id: "compute", label: "Compute", href: "/compute" },
  { id: "instances", label: "Instances", href: "/compute/instances" },
  { id: "web-1", label: "web-server-01" },
]);

<Breadcrumbs
  items={trail}
  editable
  onRename={(title) => setTrail((t) => t.map((it, i) => (i === t.length - 1 ? { ...it, label: title } : it)))}
/>
```

## Incorrect

```tsx
<Breadcrumbs>
  <a href="/">Home</a>
</Breadcrumbs>
```

## Known footguns

- Omitting `items` renders demo placeholder items ("Breadcrumb / Last Item Title"). Always pass real `items`.
- The last item is always the current page: plain bold text, never a link, its `href`/`onClick` are ignored.
- Items with `href` render as links, others as buttons. Either way `onNavigate` fires, after the item's own `onClick`.
- `editable` only adds a pencil on hover/focus of the last item. Click it to swap in a text field with confirm/cancel (Enter confirms, Escape cancels).
- `onRename` receives the trimmed new title, and only when it is non-empty and different. Breadcrumbs never changes `items` itself: update your own state, or the old title comes back.
- No overflow handling: very long trails wrap onto further lines. Keep trails short.
