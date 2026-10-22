# Toast

Floating notification fixed to the bottom-right of the viewport. Shows one short message with a status icon and a × button, and closes itself after 5 seconds.

## When to use / when not to use

- Use for brief, non-blocking feedback after an action: "Saved", "Record deleted", "Could not reach the server".
- Do NOT use for persistent page-level messages. Use `NotificationBanner`.
- Do NOT use for confirmations that need a decision. Use `Modal`.
- One toast at a time. There is no stack, queue or global `toast.open()` service.

## Import

```tsx
import { Toast, type ToastProps } from "figma-make-bridge";
```

## Props

| Prop | Type | Default | Allowed values |
|---|---|---|---|
| `open` | `boolean` | required | Controlled visibility |
| `onClose` | `() => void` | required | Fired by the × and by the auto-dismiss timer |
| `children` | `ReactNode` | required | The message text, one short line |
| `type` | `"info" \| "warning" \| "error" \| "success"` | `"info"` | |
| `duration` | `number` | `5000` | Milliseconds until `onClose` fires. `0` disables auto-dismiss |
| `className` | `string` | none | |

## Valid values

- `type`: `info`, `warning`, `error`, `success` only. There is no `secondary`.
- Invalid or non-existent: `variant`, `severity`, `message`, `text`, `timeout`, `autoClose`, `position`, `isVisible`, `dismissible`, `action`, `title`.

## Correct

```tsx
const [saved, setSaved] = useState(false);

<Button onClick={() => { save(); setSaved(true); }}>Save</Button>
<Toast open={saved} type="success" onClose={() => setSaved(false)}>
  Changes saved.
</Toast>
```

## Incorrect

```tsx
<Toast severity="danger" message="Failed" timeout={3000} position="top-right" />
```

`severity`, `message`, `timeout` and `position` do not exist, `"danger"` is not a type, and `open`/`onClose` are required. Use `type="error"`, put the text in `children`, use `duration={3000}`. The position is fixed.

## Known footguns

- Visibility is fully controlled. The toast never hides itself: `onClose` must set `open` to false. If `onClose` does nothing, the toast stays on screen.
- Render the `Toast` once, always mounted, and toggle `open`. It renders nothing until the first time `open` is true, then slides in and out.
- The timer starts when `open` becomes true. Changing `children` while it is open does not restart it. To show a new message, set `open` to false first, or give the `Toast` a new `key`.
- Position is fixed to the bottom-right (24px from the edges) and it sits above `Modal` and `Drawer`. Two toasts open at once overlap each other. Keep one `open` state shared by all messages.
- `children` is one short line, max width 300px. Longer text wraps. Do not put buttons or links inside.
- `type="error"` and `type="warning"` render with `role="alert"`; the others use `role="status"`.
