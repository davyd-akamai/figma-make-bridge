# ProgressBar

Horizontal bar showing measurable progress of a task (a deployment, an upload, a multi-step job), optionally with a title, status text, description and link.

## When to use / when not to use

- Use when you know how far along a task is (a value out of a maximum) or that it succeeded or failed.
- For a task with no measurable progress, do not fake a value. There is no indeterminate or spinner variant.
- For a transient confirmation after an action, use `Toast` (components/toast.md). For a persistent inline message, use `NotificationBanner` (components/notification-banner.md).

## Import

```tsx
import { ProgressBar, type ProgressBarProps, type ProgressBarSize, type ProgressBarState } from "figma-make-bridge";
```

## Props

| Prop | Type | Default | Allowed values |
|---|---|---|---|
| `value` | `number` | `0` | `0` to `max`; clamped |
| `max` | `number` | `100` | Greater than 0 |
| `state` | `ProgressBarState` | derived from `value` | `"empty"`, `"in-progress"`, `"success"`, `"error"` |
| `size` | `ProgressBarSize` | `"large"` | `"large"` (8px line), `"small"` (4px line) |
| `title` | `ReactNode` | none | Bold text above the description; also the accessible name |
| `meta` | `ReactNode` | none | Right-aligned text beside the title (for example "Est. 1 minute left") |
| `description` | `ReactNode` | none | Regular text under the title |
| `link` | `ReactNode` | none | An `<a>` or `<button>`, shown under the description in the link color |
| `className` | `string` | none | Replaces the default layout classes |

Standard `<div>` props (`aria-label`, `id`, etc.) pass through. `role` is fixed to `progressbar`.

## Valid values

- `state`: `"empty"`, `"in-progress"`, `"success"`, `"error"`. Omit it to derive it: `value <= 0` is empty, `value >= max` is success, anything between is in progress.
- `size`: `"large"`, `"small"`.
- Invalid or non-existent: `type`, `variant`, `percent`, `progress`, `indeterminate`, `label` (use `title`), `size="medium"`, `state="loading"`, `state="complete"`.

## Correct

```tsx
<ProgressBar value={progress} title="Property deploying..." meta="Est. 1 minute left" />
```

```tsx
<ProgressBar value={100} title="Property successfully deployed!" description="Your changes are live." link={<a href="/properties">View property</a>} />
```

```tsx
<ProgressBar state="error" title="Error deploying property!" link={<button type="button" onClick={retry}>Try again</button>} />
```

```tsx
<ProgressBar value={uploaded} max={total} size="small" aria-label="Upload progress" />
```

## Incorrect

```tsx
<ProgressBar percent={40} />
<ProgressBar value={40} state="loading" label="Deploying" />
```

The props are `value` and `title`, and `state` takes `"in-progress"`.

## Known footguns

- **Nothing is rendered by default except the line.** Title, meta, description and link appear only when passed. A line with none of them is "line only".
- **Pass `state="error"` yourself.** Error is never derived. It fills the whole line in red regardless of `value`.
- **The in-progress fill animates** (a light band sweeps across it, off for users who prefer reduced motion). Success, error and empty are static. There is no prop to turn it off.
- **Success and error fill 100%; empty fills 0%**, whatever `value` says when `state` is set explicitly.
- **`meta` is hidden in success and error.** It is meant for "time left" style text that stops being true once the task ends.
- **The line-only bar has no text.** Give it an `aria-label`; with a string `title` the accessible name is set for you.
- **`link` is a slot, not a prop pair.** Pass your own `<a href>` or `<button onClick>`; it inherits the link color and hover color and has no underline.
- Keep a bar to the width of its container (it is full width). Do not stack many bars for one task; use one.
