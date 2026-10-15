# Button

The only button primitive in the system.

## When to use / when not to use

- Use for every action: row action, modal-style Save/Cancel, page-level CTA, form submit.
- Do NOT hand-build a `<button>` with custom classes where `Button` would do the job.
- Choose `variant` and `size` to fit the context. Do not reimplement the visual treatment.

## Import

```tsx
import { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from "@make-kits/ads-components";
```

## Props

| Prop | Type | Default | Allowed values |
|---|---|---|---|
| `variant` | `ButtonVariant` | `"primary"` | `"primary"`, `"secondary"`, `"link"`, `"danger"` |
| `size` | `ButtonSize` | `"large"` | `"large"`, `"small"` |
| `loading` | `boolean` | `false` | `true`, `false` |
| `disabled` | `boolean` | `false` | `true`, `false` |
| `startIcon` | `ReactNode` | none | An icon from foundations/icons.md |
| `endIcon` | `ReactNode` | none | An icon from foundations/icons.md |
| `children` | `ReactNode` | required | |
| `type` | `string` | `"button"` | Standard `<button>` `type` |

Standard `<button>` props (`onClick`, `aria-*`, etc.) pass through.

## Valid values

- `"primary"`: solid, the main CTA.
- `"secondary"`: outlined.
- `"link"`: text-only, no border, background or fixed height.
- `"danger"`: solid, destructive actions such as delete.
- Invalid or non-existent: `variant="tertiary"`, `"icon"`, `"launch"`, `"ghost"`, `"outline"`, `"success"`; `size="medium"`, `"xs"`; `theme`; `color`.

## Correct

```tsx
<Button variant="secondary" size="small" startIcon={<PlusIcon />}>Add</Button>
```

## Incorrect

```tsx
<Button variant="tertiary" style={{ background: "red" }}>Add</Button>
```

## Known footguns

- **Never pass `Button` directly as the child of a Radix `asChild` trigger.** This covers `PopoverTrigger`, `TooltipTrigger`, `DropdownMenuTrigger`, `DialogTrigger` and any other Radix primitive using `asChild`. Radix `Slot` clones its child and merges DOM props onto it. That can clobber `Button`'s own `variant` and `size` props and crash the render.
- Instead, make a plain `<span className="inline-flex">` the `asChild` target and nest `Button` inside. Clicks bubble to the span normally.

```tsx
<PopoverTrigger asChild>
  <span className="inline-flex">
    <Button variant="secondary" size="small">Settings</Button>
  </span>
</PopoverTrigger>
```

- `loading` keeps the button's size, hides its label and icons behind a centered spinner, and disables clicks. Use it for an async action in flight, not as a permanent state.
- Icons are sized automatically (16px large, 12px small). Use only icons from the pack. Never hand-draw one.
