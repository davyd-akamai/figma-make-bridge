# Search

Standalone search input with a fixed leading search icon and optional suggestions.

## When to use / when not to use

- Use for any search-style box. `TextField` has no leading icon.
- It is always unlabeled: no `label`, no label position. Give context with `placeholder` and `aria-label`.
- It has no `readOnly` state.

## Import

```tsx
import { Search, type SearchProps } from "figma-make-bridge";
```

## Props

| Prop | Type | Default | Allowed values |
|---|---|---|---|
| `value` | `string` | unset (uncontrolled) | |
| `defaultValue` | `string` | `""` | |
| `onChange` | `(value: string) => void` | none | Fires on every keystroke |
| `onSearch` | `(value: string) => void` | none | Enter with no suggestion highlighted |
| `placeholder` | `string` | `"Search"` | |
| `helperText` | `string` | none | |
| `errorText` | `string` | none | |
| `disabled` | `boolean` | `false` | |
| `clearable` | `boolean` | `true` | |
| `suggestions` | `string[]` | unset (no dropdown) | `[]` shows `noResultsMessage` |
| `onSelectSuggestion` | `(suggestion: string) => void` | none | |
| `noResultsMessage` | `string` | `"No items found"` | |
| `id` | `string` | generated | |
| `className` | `string` | none | Replaces the default `w-full` class |
| `aria-label` | `string` | `placeholder` | |

## Valid values

- No enum props.
- Invalid or non-existent: `label`, `labelPosition`, `readOnly`, `icon`, `startIcon`, `size`, `variant`, `loading`.

## Correct

```tsx
<div style={{ width: 400 }}>
  <Search placeholder="Search instances" aria-label="Search instances" onSearch={runQuery} />
</div>
```

## Incorrect

```tsx
<Search label="Search" readOnly onChange={(e) => setQ(e.target.value)} />
```

## Known footguns

- `suggestions` is opt-in. Omit it for a plain box that never shows a dropdown.
- Pass a `string[]` to enable the dropdown. `Search` filters it locally (case-insensitive substring) and shows it only once something is typed.
- Pass `[]` when your own query has run and found nothing, so `noResultsMessage` renders.
- `onChange` fires on every keystroke. Use it to compute `suggestions`.
- `errorText` shows an error message below the field and switches to the red-border error state. `helperText` is the neutral guidance line.
- Width is the wrapper's job. Follow the form field width rule in components/overview.md.
