# TextArea

Multi-line text input with label, helper text, error state, clear button and a vertical resize handle.

## When to use / when not to use

- Use for free text longer than one line: descriptions, notes, comments, JSON/text blobs.
- For a single-line value, use `TextField` (components/text-field.md). `TextArea` is not a one-line input.
- For picking from a list, use `Select` (components/select.md).

## Import

```tsx
import { TextArea, type TextAreaProps, type TextAreaLabelPosition } from "figma-make-bridge";
```

## Props

| Prop | Type | Default | Allowed values |
|---|---|---|---|
| `label` | `string` | none | omit for an unlabeled field |
| `labelPosition` | `TextAreaLabelPosition` | `"top"` | `"top"`, `"left"` |
| `value` | `string` | unset (uncontrolled) | |
| `defaultValue` | `string` | `""` | |
| `onChange` | `(value: string) => void` | none | Receives the string, not an event |
| `helperText` | `string` | none | |
| `errorText` | `string` | none | |
| `infoIcon` | `boolean` | `false` | |
| `labelInfoIcon` | `boolean` | `false` | |
| `infoText` | `string` | none | |
| `onInfoIconClick` | `() => void` | none | |
| `clearable` | `boolean` | `true` | |
| `rows` | `number` | `3` | positive integer; sets the initial height |
| `disabled` | `boolean` | `false` | |
| `readOnly` | `boolean` | `false` | |
| `className` | `string` | none | |

Standard `<textarea>` props (`placeholder`, `name`, `required`, `maxLength`, etc.) pass through.

## Valid values

- `labelPosition`: `"top"`, `"left"`.
- Invalid or non-existent: `startIcon`, `leadingIcon`, `prefix`, `suffix`, `size`, `variant`, `error` (boolean), `resize`, `autoGrow`, `cols`.

## Correct

```tsx
<div style={{ width: 400 }}>
  <TextArea label="Description" value={text} onChange={setText} errorText={text ? undefined : "Required"} />
</div>
```

## Incorrect

```tsx
<TextArea label="Description" onChange={(e) => setText(e.target.value)} />
```

`onChange` receives a string, not an event.

## Known footguns

- The user can drag the bottom-right handle to resize vertically. There is no prop to turn this off or to auto-grow. Use `rows` to set the starting height.
- Omit `label` for an unlabeled field and pass an explicit `aria-label`.
- `labelPosition="left"` puts the label beside the field, aligned with the first line of text. Use it for compact form rows, not as a default.
- `errorText` shows the message below the field and switches to the red-border error state in one prop. Do not drive the error visual separately. `helperText` is hidden while `errorText` is present.
- `clearable` shows a clear (×) button once there is a value. Set `false` only when clearing makes no sense.
- `readOnly` renders plain text with no box, resize handle or clear button. `disabled` stays box-shaped and greyed out. Use `readOnly` for a value the user cannot edit here, `disabled` for a value that is temporarily not editable.
- `infoIcon` (beside the field) and `labelInfoIcon` (next to the label text) with `infoText`/`onInfoIconClick` are a placeholder for a future Tooltip. Use only when the label needs supplementary explanation.
- Width is the wrapper's job. Follow the form field width rule in components/overview.md.
