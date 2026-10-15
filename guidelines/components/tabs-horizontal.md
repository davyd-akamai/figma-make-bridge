# TabsHorizontal

Horizontal tab headers with automatic overflow. Headers only: there is no content panel.

## When to use / when not to use

- Use to switch between views on one page.
- Render the content for the active tab yourself.
- Do not hand-build tab scrolling or truncation.

## Import

```tsx
import { TabsHorizontal, type TabsHorizontalProps, type TabsHorizontalTab, type TabsHorizontalSize } from "figma-make-bridge";
```

## Props

| Prop | Type | Default | Allowed values |
|---|---|---|---|
| `tabs` | `TabsHorizontalTab[]` | demo placeholder tabs | Always pass real `tabs` |
| `size` | `TabsHorizontalSize` | `"large"` | `"large"`, `"small"` |
| `selectedTabId` | `string` | unset (uncontrolled) | a tab `id` |
| `defaultSelectedTabId` | `string` | first enabled tab | a tab `id` |
| `onSelectTab` | `(tabId: string) => void` | none | |
| `moreLabel` | `string` | `"More tabs"` | |
| `aria-label` | `string` | none | |
| `className` | `string` | none | |

`TabsHorizontalTab`: `{ id: string; label: string; icon?: ReactNode; badge?: string; disabled?: boolean }`. Each `id` is unique.

## Valid values

- `size`: `"large"`, `"small"`.
- Invalid or non-existent: `children`, `panels`, `content`, `orientation`, `variant`, `badge` as an object or color.

## Correct

```tsx
const [tab, setTab] = useState("overview");
<TabsHorizontal
  aria-label="Instance sections"
  tabs={[{ id: "overview", label: "Overview" }, { id: "metrics", label: "Metrics", badge: "New" }]}
  selectedTabId={tab}
  onSelectTab={setTab}
/>
{tab === "overview" ? <Overview /> : <Metrics />}
```

## Incorrect

```tsx
<TabsHorizontal tabs={tabs}>
  <div>Panel content</div>
</TabsHorizontal>
```

## Known footguns

- Controlled: pass `selectedTabId` + `onSelectTab` and switch your content on the same state. Use `defaultSelectedTabId` for a self-managed header only when the content below does not depend on it.
- Omitting `tabs` renders demo tabs. Always pass real `tabs`.
- `icon` is a plain `ReactNode` slot, typically an icon from foundations/icons.md at `size={16}`. No default icon.
- `badge` is a short string rendered with `Badge` in a fixed subtle ultramarine style. You cannot choose its color or type.
- Overflow is automatic: trailing tabs collapse into a "..." button that opens a menu. Not a prop.
- Keyboard support (arrow keys, Home, End) is built in.
