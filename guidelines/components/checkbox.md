# Checkbox

On/off choice, with an indeterminate state for select-all.

## When to use / when not to use

- Use for standalone form fields and filter lists.
- For a setting that applies immediately when flipped, use `Switch` (components/switch.md).
- For one choice out of a group, use `RadioButton` (components/radio-button.md).
- In a `Table`, do not build selection checkboxes yourself. Use `selectable` (components/table.md).

## Import

```tsx
import { Checkbox, type CheckboxProps, type CheckboxSize } from "figma-make-bridge";
```

## Props

| Prop | Type | Default | Allowed values |
|---|---|---|---|
| `checked` | `boolean` | unset (uncontrolled) | |
| `defaultChecked` | `boolean` | `false` | |
| `onChange` | `(checked: boolean) => void` | none | |
| `indeterminate` | `boolean` | `false` | |
| `label` | `string` | none | |
| `size` | `CheckboxSize` | `"large"` | `"large"` (20px), `"small"` (16px) |
| `disabled` | `boolean` | `false` | |
| `readOnly` | `boolean` | `false` | |
| `infoIcon` | `boolean` | `false` | |
| `infoText` | `string` | none | |
| `onInfoIconClick` | `() => void` | none | |
| `className` | `string` | none | |

Standard `<input>` props (`name`, `value`, `required`, etc.) pass through. `type` is fixed.

## Valid values

- `size`: `"large"`, `"small"`.
- Invalid or non-existent: `size="medium"`, `"xs"`; `variant`; `color`; `onChange` with an event argument (it receives a boolean); `isChecked`; `isDisabled`.

## Correct

```tsx
<Checkbox label="Enable backups" defaultChecked />
```

## Incorrect

```tsx
<Checkbox label="Enable backups" size="small" onChange={(e) => setOn(e.target.checked)} />
```

`small` outside a table, and `onChange` takes a boolean, not an event.

## Known footguns

- **Default `size` is `"large"`.** Use it for almost every checkbox on a page.
- **`size="small"` is reserved for tables and dense lists** where a 20px control would crowd the row. Never use it as a general stylistic choice. `Table` already renders its own selection checkboxes at `small`.
- `indeterminate` is a separate visual flag from `checked`, not a third value. For select-all, compute it on every render as `someChecked && !allChecked`. It does not clear itself on click. Parent state drives it.
- `readOnly` and `disabled` are both non-interactive but look different (readOnly: thin border, no fill; disabled: greyed fill). Do not substitute one for the other.
- `infoIcon` shows an info icon after the label. Hovering or tabbing to it shows a `Tooltip` with `infoText`; `onInfoIconClick` is optional. Always pass `infoText`, or the icon shows nothing. Use only when the label needs supplementary explanation. Not as a decorative default.
