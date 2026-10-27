# TextField

Single-line text input with label, helper text, error state and clear button.

## When to use / when not to use

- Use for any free-text, numeric or short-value input.
- For a search-style box with a leading magnifier, use `Search` (components/search.md). `TextField` has no leading icon.
- For picking from a list, use `Select` (components/select.md).

## Import

```tsx
import { TextField, type TextFieldProps, type TextFieldLabelPosition } from "figma-make-bridge";
```

## Props

| Prop | Type | Default | Allowed values |
|---|---|---|---|
| `label` | `string` | none | omit for an unlabeled field |
| `labelPosition` | `TextFieldLabelPosition` | `"top"` | `"top"`, `"left"` |
| `value` | `string` | unset (uncontrolled) | |
| `defaultValue` | `string` | `""` | |
| `onChange` | `(value: string) => void` | none | Receives the string, not an event |
| `helperText` | `string` | none | |
| `errorText` | `string` | none | |
| `infoIcon` | `boolean` | `false` | |
| `infoText` | `string` | none | |
| `onInfoIconClick` | `() => void` | none | |
| `clearable` | `boolean` | `true` | |
| `disabled` | `boolean` | `false` | |
| `readOnly` | `boolean` | `false` | |
| `type` | `string` | `"text"` | Standard input `type` |
| `className` | `string` | none | |

Standard `<input>` props (`placeholder`, `name`, `required`, etc.) pass through.

## Valid values

- `labelPosition`: `"top"`, `"left"`.
- Invalid or non-existent: `startIcon`, `leadingIcon`, `prefix`, `suffix`, `size`, `variant`, `error` (boolean), `multiline`, `rows` (for multi-line text use `TextArea`).

## Correct

```tsx
<div style={{ width: 400 }}>
  <TextField label="Label" value={name} onChange={setName} errorText={name ? undefined : "Required"} />
</div>
```

## Incorrect

```tsx
<TextField label="Label" onChange={(e) => setName(e.target.value)} startIcon={<SearchIcon />} />
```

`onChange` receives a string, and `startIcon` does not exist.

## Known footguns

- Omit `label` for an unlabeled field and pass an explicit `aria-label`.
- `labelPosition="left"` puts the label beside the field. Use it for compact form rows, not as a default.
- `errorText` shows the message below the field and switches to the red-border error state in one prop. Do not drive the error visual separately.
- `helperText` is hidden automatically while `errorText` is present. No need to omit one when passing the other.
- `clearable` shows a clear button once the field has a value. Set `false` only when clearing makes no sense (a fixed or derived value).
- `readOnly` renders plain text with no input box or clear button. `disabled` is greyed-out but still box-shaped. Use `readOnly` for a value the user cannot edit here, `disabled` for a value that is temporarily not editable.
- `infoIcon`, `infoText`, `onInfoIconClick` are a placeholder for a future Tooltip. Use only when the label needs supplementary explanation.
- Do not fake a leading icon by absolutely positioning one over a `TextField`.
- Width is the wrapper's job. Follow the form field width rule in components/overview.md (about 400px by default).
