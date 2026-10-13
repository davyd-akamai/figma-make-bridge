# RadioButton

One choice from a group of options.

## When to use / when not to use

- Use for a small, visible group where exactly one option is chosen.
- For a longer list, use `Select` (components/select.md).
- For independent on/off choices, use `Checkbox` (components/checkbox.md).

## Import

```tsx
import { RadioButton, type RadioButtonProps, type RadioButtonSize } from "figma-make-bridge";
```

## Props

| Prop | Type | Default | Allowed values |
|---|---|---|---|
| `checked` | `boolean` | unset (uncontrolled) | |
| `defaultChecked` | `boolean` | `false` | |
| `onChange` | `() => void` | none | Fires with no argument |
| `label` | `string` | none | |
| `size` | `RadioButtonSize` | `"large"` | `"large"` (20px), `"small"` (16px) |
| `disabled` | `boolean` | `false` | |
| `readOnly` | `boolean` | `false` | |
| `infoIcon` | `boolean` | `false` | |
| `infoText` | `string` | none | |
| `onInfoIconClick` | `() => void` | none | |
| `className` | `string` | none | |

Standard `<input>` props (`name`, `value`, `required`, etc.) pass through. `type` is fixed.

## Valid values

- `size`: `"large"`, `"small"`.
- Invalid or non-existent: `size="medium"`; `options`; `group`; `onChange` with a value or event argument; `variant`.

## Correct

```tsx
<RadioButton name="plan" value="a" label="Plan A" checked={plan === "a"} onChange={() => setPlan("a")} />
<RadioButton name="plan" value="b" label="Plan B" checked={plan === "b"} onChange={() => setPlan("b")} />
```

## Incorrect

```tsx
<RadioButton label="Plan A" onChange={(value) => setPlan(value)} />
```

No shared `name`, and `onChange` receives no argument.

## Known footguns

- **Group related radios with a shared `name`.** That makes them mutually exclusive. The component does not manage group state. Each `RadioButton` is independent.
- `onChange` takes no argument and fires only when this radio becomes selected (native behavior). Do not expect a call with `false` when a sibling is selected.
- Same `size`, `disabled`, `readOnly` and `infoIcon` conventions as `Checkbox`. Default `size="large"`. Reserve `size="small"` for tables and dense lists only.
- `infoIcon` is a placeholder for a future Tooltip.
