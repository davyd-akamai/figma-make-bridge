# Modal

Centered dialog with a title, text body, and right-aligned actions, over a dimmed backdrop.

## When to use / when not to use

- Use for short confirmations or blocking questions ("Are you sure?").
- Do NOT use for forms or detail views that need space or scrolling. Use `Drawer`.
- One fixed width (459px, shrinks on narrow screens). There is no `size` prop.

## Import

```tsx
import { Modal, type ModalProps } from "figma-make-bridge";
```

## Props

| Prop | Type | Default | Allowed values |
|---|---|---|---|
| `open` | `boolean` | required | controlled |
| `onClose` | `() => void` | required | |
| `title` | `string` | `"Basic modal"` | Always pass a real title |
| `icon` | `ReactNode` | none | An icon from foundations/icons.md |
| `children` | `ReactNode` | none | Body text (Body/Regular) |
| `footer` | `ReactNode` | none | Actions slot, right-aligned |
| `overlay` | `boolean` | `true` | |
| `closeOnOverlayClick` | `boolean` | `true` | |
| `closeOnEsc` | `boolean` | `true` | |
| `className` | `string` | none | |
| `aria-label` / `aria-labelledby` | `string` | none | |

## Valid values

- Invalid or non-existent: `size`, `width`, `variant`, `description`, `actions`, `onOpenChange`, `defaultOpen`, `isOpen`.

## Correct

```tsx
<Modal open={open} onClose={() => setOpen(false)} title="Delete instance?"
  footer={<>
    <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="primary" onClick={confirm}>Delete</Button>
  </>}>
  This can't be undone.
</Modal>
```

## Incorrect

```tsx
<Modal isOpen size="medium" description="..." actions={[...]} />
```

Missing `open`/`onClose`; `isOpen`, `size`, `description` and `actions` do not exist.

## Known footguns

- Visibility is fully controlled. Keep an `open` boolean in state, set it `true` from a trigger and `false` in `onClose`.
- `onClose` fires for the close icon, Esc and overlay click.
- `footer` is a plain slot for library `Button`s, typically a `secondary` and a `primary`. Put the primary action last.
- `children` is the description text. Keep it short; for rich or long content use `Drawer`.
- Focus is trapped inside the open modal, the page behind is scroll-locked, and focus returns to the previous element on close. Built in.
- `icon` is a plain `ReactNode` slot. No default icon.
