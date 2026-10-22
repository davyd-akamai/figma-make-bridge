# NotificationBanner

Full-width inline message with a status icon, text, an optional action and an optional dismiss button.

## When to use / when not to use

- Use for page-level or section-level status messages: info, warning, success, error, or a neutral secondary note.
- Do NOT use for blocking confirmations. Use `Modal`.
- Do NOT use for floating, auto-dismissing messages. There is no `Toast`.
- Fills the width of its parent, clamped between 240px and 1000px. Constrain the wrapper if you need it narrower than 1000px.

## Import

```tsx
import { NotificationBanner, type NotificationBannerProps } from "figma-make-bridge";
```

## Props

| Prop | Type | Default | Allowed values |
|---|---|---|---|
| `children` | `ReactNode` | required | The message text |
| `type` | `"info" \| "warning" \| "success" \| "error" \| "secondary"` | `"info"` | |
| `dismissible` | `boolean` | `true` | Shows the × button |
| `onDismiss` | `() => void` | none | Fires when × is clicked |
| `action` | `ReactNode` | none | A `<Button variant="link">` |
| `className` | `string` | none | |

## Valid values

- `type`: `info`, `warning`, `success`, `error`, `secondary` only.
- Invalid or non-existent: `variant`, `severity`, `text`, `message`, `title`, `actionLabel`, `onAction`, `dismissAfter`, `dismissed`, `open`, `tip`.

## Correct

```tsx
{show && (
  <NotificationBanner
    type="warning"
    onDismiss={() => setShow(false)}
    action={<Button variant="link" onClick={review}>Review</Button>}
  >
    Your certificate expires in 7 days.
  </NotificationBanner>
)}
```

## Incorrect

```tsx
<NotificationBanner severity="danger" message="Failed" actionLabel="Retry" />
```

`severity`, `message` and `actionLabel` do not exist, and `"danger"` is not a type. Use `type="error"`, put the text in `children` and pass the action as a `Button`.

## Known footguns

- Dismissal is fully controlled. The banner never hides itself: `onDismiss` must remove it (conditionally render it or track a boolean). With `dismissible` left on and no `onDismiss`, the × does nothing.
- Pass `dismissible={false}` for a persistent banner with no × button.
- `action` is a plain slot, right-aligned before the ×. Use one `Button` with `variant="link"`; other variants break the layout.
- The text is one short line by default and wraps if long. The icon and × stay aligned to the first line.
- There is no auto-dismiss timer.
- `type="error"` and `type="warning"` render with `role="alert"`; the others use `role="status"`.
