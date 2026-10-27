# Select

Single-select dropdown with type-to-filter.

## When to use / when not to use

- Use to pick one value from a list of options.
- Do NOT use it for multi-select, checkbox items, grouped lists or async loading. None exist. Say so in the reply. Do not fake it with `Select`. To collect several free-text or suggested values as tags, use `TagInput` (components/tag-input.md).
- For a short visible group, `RadioButton` may fit better (components/radio-button.md).

## Import

```tsx
import { Select, type SelectProps, type SelectOption, type SelectLabelPosition } from "figma-make-bridge";
```

## Props

| Prop | Type | Default | Allowed values |
|---|---|---|---|
| `options` | `SelectOption[]` | demo "Item 1-3" | Always pass real options |
| `value` | `string \| null` | unset (uncontrolled) | `null` = no selection |
| `defaultValue` | `string \| null` | `null` | |
| `onChange` | `(value: string \| null, option: SelectOption \| null) => void` | none | Both `null` when cleared |
| `placeholder` | `string` | `"Select"` | |
| `label` | `string` | none | |
| `labelPosition` | `SelectLabelPosition` | `"top"` | `"top"`, `"left"` |
| `helperText` | `string` | none | |
| `errorText` | `string` | none | |
| `infoIcon` / `infoText` / `onInfoIconClick` | `boolean` / `string` / `() => void` | `false` / none / none | |
| `clearable` | `boolean` | `true` | |
| `disabled` / `readOnly` | `boolean` | `false` | |
| `creatable` | `boolean` | `false` | |
| `onCreateOption` | `(query: string) => void` | none | |
| `emptyMessage` | `string` | `"No options available"` | |
| `id` | `string` | generated | |
| `className` | `string` | none | |
| `aria-label` | `string` | none | |

`SelectOption`: `{ value: string; label: string; icon?: ReactNode; disabled?: boolean }`.

## Valid values

- `labelPosition`: `"top"`, `"left"`.
- Invalid or non-existent: `multiple`, `isMulti`, `groups`, `loading`, `loadOptions`, `searchable` (filtering is always on), `size`, `variant`.

## Correct

```tsx
<div style={{ width: 400 }}>
  <Select label="Region" options={regions} value={region} onChange={(v) => setRegion(v)} />
</div>
```

## Incorrect

```tsx
<Select multiple options={regions} onChange={(e) => setRegion(e.target.value)} />
```

## Known footguns

- Controlled or uncontrolled like other fields: `value` + `onChange`, or `defaultValue`.
- Every `Select` is always type-to-filter (case-insensitive match on `label`). There is no prop to change that.
- No match with `creatable={false}` shows `emptyMessage`. With `creatable` the dropdown shows a `Create "<query>"` row and fires `onCreateOption(query)`.
- **`Select` never changes its own `options`.** In `onCreateOption`, add the new option to your `options` state and set `value` yourself.
- Per-option `icon` is a plain `ReactNode` slot (an icon from foundations/icons.md or a flag element). No default. `disabled` options are skipped by the keyboard and cannot be chosen.
- `label`, `labelPosition`, `helperText`, `errorText`, `infoIcon`, `clearable`, `disabled`, `readOnly` follow the same rules as `TextField` (components/text-field.md). Omit `label` for an unlabeled field and pass `aria-label`.
- Keyboard (ArrowUp/ArrowDown, Enter, Escape) is built in. Nothing to wire.
- Width is the wrapper's job. Follow the form field width rule in components/overview.md.
