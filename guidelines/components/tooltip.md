# Tooltip

Short text label that appears next to a control on hover or keyboard focus. Wraps the control it describes.

## When to use / when not to use

- Use to name an icon-only control (an info icon, a toolbar button) or to add a few words of extra context to a control.
- Do NOT use for anything the user must read, act on or can't get another way. Tooltips don't show on touch screens. Put essential text on the page.
- Do NOT use for rich or interactive content (links, buttons, lists). A tooltip is plain text and can't be hovered.
- For a message after an action use `Toast`. For a page-level message use `NotificationBanner`.

## Import

```tsx
import { Tooltip, type TooltipProps, type TooltipPlacement } from "figma-make-bridge";
```

## Props

| Prop | Type | Default | Allowed values |
|---|---|---|---|
| `content` | `ReactNode` | required | The tooltip text. Keep it short |
| `children` | `ReactNode` | required | The trigger the tooltip describes |
| `placement` | `TooltipPlacement` | `"top"` | `"top"`, `"bottom"`, `"left"`, `"right"`: the side of the trigger the tooltip sits on |
| `arrow` | `boolean` | `true` | `false` hides the arrow |
| `disabled` | `boolean` | `false` | Never shows the tooltip |
| `className` | `string` | none | Applied to the wrapping `<span>` |

## Valid values

- `placement`: `top`, `bottom`, `left`, `right` only. There is no `"none"`, `"auto"` or `"center"`; use `arrow={false}` for a tooltip without an arrow.
- Invalid or non-existent: `title`, `text`, `label`, `tooltip`, `trigger`, `delay`, `open`, `defaultOpen`, `onOpenChange`, `side`, `align`, `showArrow`, `variant`, `maxWidth`.

## Correct

```tsx
<Tooltip content="Copy to clipboard">
  <Button variant="secondary">Copy</Button>
</Tooltip>
```

```tsx
<Tooltip content="More information" placement="bottom">
  <button type="button" aria-label="More information">
    <InfoIcon />
  </button>
</Tooltip>
```

## Incorrect

```tsx
<Tooltip text="Copy" side="top">...</Tooltip>
```

The text prop is `content`, and the side prop is `placement`.

```tsx
<Tooltip content={<a href="/docs">Read the docs</a>}>...</Tooltip>
```

A tooltip disappears when the pointer leaves the trigger, so the link can't be reached.

## Known footguns

- **Shows on hover and on keyboard focus only.** There is no `open` prop and no click or touch behavior. Esc closes it.
- **`placement` is where the tooltip sits, not where its arrow is.** `placement="top"` puts the tooltip above the trigger with the arrow pointing down. If there isn't room on that side of the viewport it flips to the opposite side automatically.
- **Wrap one element.** The trigger is wrapped in an `inline-flex` `<span>`; the tooltip is described to screen readers through the wrapped element (`aria-describedby`), so pass a single focusable element, not text.
- **Single line up to 240px, then it wraps.** Long text makes a tall bubble; shorten it instead.
- Pass an empty `content` to show nothing; the trigger renders as normal.
