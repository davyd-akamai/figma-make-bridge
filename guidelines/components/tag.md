# Tag

Small pill chip with a label, an optional leading icon and an optional remove (×) button. `TagInput` is built from it.

## When to use / when not to use

- Use to show a removable value or keyword on its own, or a "+N" overflow chip.
- For entering several values in a field, use `TagInput` (components/tag-input.md), not a row of `Tag`s you manage yourself.
- For a read-only status or category label, use `Badge` (components/badge.md). A `Tag` is for user-supplied values, a `Badge` is for system status.

## Import

```tsx
import { Tag, type TagProps } from "figma-make-bridge";
```

## Props

| Prop | Type | Default | Allowed values |
|---|---|---|---|
| `label` | `ReactNode` | required | text; for `more`, the count, e.g. `"+7"` |
| `icon` | `ReactNode` | none | a 12px icon such as `<LockIcon />` |
| `removable` | `boolean` | `true` | shows the × button |
| `onRemove` | `() => void` | none | fires on × click, or Backspace/Delete on the focused tag |
| `invalid` | `boolean` | `false` | red error styling |
| `disabled` | `boolean` | `false` | |
| `readOnly` | `boolean` | `false` | |
| `more` | `boolean` | `false` | the "+N" overflow chip: no × and no icon |
| `onClick` | `() => void` | none | makes the chip a button (meant for `more`) |
| `removeLabel` | `string` | `"Remove <label>"` | accessible name of the × button |

## Valid values

- Invalid or non-existent: `color`, `variant`, `size`, `type`, `closable`, `onClose`, `onDelete`, `selected`, `outlined`.

## Correct

```tsx
<Tag label="production" onRemove={() => setEnv(null)} />
<Tag label="system" icon={<LockIcon />} removable={false} />
```

## Incorrect

```tsx
<Tag label="production" closable onClose={() => setEnv(null)} />
```

`closable`/`onClose` do not exist. Use `removable`/`onRemove`.

## Known footguns

- A `Tag` never removes itself. `onRemove` only reports the click; you update your own state.
- `invalid` only restyles the chip. Deciding what is invalid is your job.
- The chip has a fixed 24px height and pill shape. Do not restyle it. The pill radius is intentional, an exception to the square-corners rule.
- `disabled` and `readOnly` hide the ×. `readOnly` has a border but no fill.
- The × is built in. The `icon` slot is for a 12px icon, not a 16px or 20px one.
