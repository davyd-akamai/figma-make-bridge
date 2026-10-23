# Switch

Immediate on/off toggle for a setting.

## When to use / when not to use

- Use for a setting that takes effect as soon as it is flipped (enable backups, turn on notifications).
- For a choice that is submitted with a form, or a multi-pick list, use `Checkbox` (components/checkbox.md).
- For one option out of a group, use `RadioButton` (components/radio-button.md).

## Import

```tsx
import { Switch, type SwitchProps, type SwitchSize } from "figma-make-bridge";
```

## Props

| Prop | Type | Default | Allowed values |
|---|---|---|---|
| `checked` | `boolean` | unset (uncontrolled) | |
| `defaultChecked` | `boolean` | `false` | |
| `onChange` | `(checked: boolean) => void` | none | Receives the new boolean, not an event |
| `label` | `string` | none | Shown to the right of the switch |
| `size` | `SwitchSize` | `"large"` | `"large"` (48x24), `"small"` (40x20) |
| `disabled` | `boolean` | `false` | |
| `className` | `string` | none | |

Standard `<input>` props (`name`, `id`, `aria-label`, etc.) pass through. `type` and `role` are fixed.

## Valid values

- `size`: `"large"`, `"small"`.
- Invalid or non-existent: `size="medium"`; `readOnly`; `isOn`; `value`; `labelPosition`; `onChange` with an event argument.

## Correct

```tsx
const [backups, setBackups] = useState(true);
<Switch label="Enable backups" checked={backups} onChange={setBackups} />
```

```tsx
<Switch aria-label="Enable backups" defaultChecked />
```

## Incorrect

```tsx
<Switch label="Enable backups" onChange={(e) => setBackups(e.target.checked)} />
```

`onChange` receives a boolean, not an event.

## Known footguns

- **`onChange` receives the new `boolean`**, same as `Checkbox`.
- **Default `size` is `"large"`.** Use it for almost every switch on a page. `size="small"` is reserved for tables and dense lists where a 24px control would crowd the row.
- **The label is always to the right.** There is no label-position prop. Omit `label` for a bare switch and pass `aria-label`.
- **No read-only state.** Use `disabled`, or show the value as text.
- Keyboard focus does not change the track color, so do not rely on color alone to show a focused switch.
- There is no master/"select all" switch. Do not build one from `Switch`.
