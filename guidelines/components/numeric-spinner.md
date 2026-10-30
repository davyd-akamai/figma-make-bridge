# NumericSpinner

Single-number input with up/down chevrons, optional min/max/step, label, helper text and error state.

## When to use / when not to use

- Use for a small bounded or stepped number: replica count, port, quantity, timeout.
- For free text or a number that is long and unbounded (IDs, phone numbers), use `TextField` (components/text-field.md).
- For choosing from a fixed list of values, use `Select` (components/select.md).

## Import

```tsx
import { NumericSpinner, type NumericSpinnerProps, type NumericSpinnerLabelPosition } from "figma-make-bridge";
```

## Props

| Prop | Type | Default | Allowed values |
|---|---|---|---|
| `label` | `string` | none | omit for an unlabeled field |
| `labelPosition` | `NumericSpinnerLabelPosition` | `"top"` | `"top"`, `"left"` |
| `value` | `number \| null` | unset (uncontrolled) | `null` is an empty field |
| `defaultValue` | `number \| null` | `null` | |
| `onChange` | `(value: number \| null) => void` | none | Receives the number (or `null`), not an event |
| `min` | `number` | none | |
| `max` | `number` | none | |
| `step` | `number` | `1` | must be greater than 0 |
| `placeholder` | `string` | `"0"` | |
| `helperText` | `string` | none | |
| `errorText` | `string` | none | |
| `labelInfoIcon` | `boolean` | `false` | |
| `infoText` | `string` | none | |
| `disabled` | `boolean` | `false` | |
| `readOnly` | `boolean` | `false` | |
| `className` | `string` | none | |

Standard `<input>` props (`name`, `required`, `aria-label`, etc.) pass through, except `type`, `min`, `max` and `step`, which are the props above.

## Valid values

- `labelPosition`: `"top"`, `"left"`.
- Invalid or non-existent: `size`, `variant`, `error` (boolean), `unit`, `suffix`, `prefix`, `clearable`, `infoIcon`, `onInfoIconClick`, `type`.

## Correct

```tsx
<div style={{ width: 160 }}>
  <NumericSpinner label="Replicas" min={1} max={10} value={replicas} onChange={setReplicas} />
</div>
```

## Incorrect

```tsx
<NumericSpinner label="Replicas" onChange={(e) => setReplicas(Number(e.target.value))} />
```

`onChange` receives a number or `null`, not an event.

## Known footguns

- `onChange` fires on every keystroke and with `null` when the field is emptied. Handle `null` (for example keep the previous value, or treat it as "unset").
- `min` and `max` limit the chevrons, Arrow Up/Down and Home/End only. A typed number outside the range is kept as typed. Validate it yourself and pass `errorText`.
- `errorText` shows the message below the field and switches to the red border in one prop. `helperText` is hidden while `errorText` is present.
- An empty field starts at 0 (clamped to `min`/`max`) on the first chevron click or Arrow key.
- `step` also sets how many decimals are shown (`step={0.25}` shows two). Use whole steps for integers.
- Holding a chevron repeats the step. The chevrons are mouse-only and are not tab stops; keyboard users use Arrow Up/Down in the field.
- `readOnly` renders plain text with no box or chevrons. `disabled` is greyed-out and still box-shaped.
- `labelInfoIcon` puts an info icon after the label with a `Tooltip` showing `infoText`. Always pass `infoText`, and only together with `label`. There is no info icon beside the field.
- Width is the wrapper's job. Follow the form field width rule in components/overview.md (a number field is about 160-200px).
