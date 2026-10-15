# Drawer

Right-hand slide-in panel with a title, scrolling content and an optional sticky footer.

## When to use / when not to use

- Use for edit or detail panels opened from a trigger.
- Do NOT use it as a centered modal dialog. No modal component exists in this version. Flag it.
- Right side only. There is no `position` prop.

## Import

```tsx
import { Drawer, type DrawerProps, type DrawerSize } from "@make-kits/ads-components";
```

## Props

| Prop | Type | Default | Allowed values |
|---|---|---|---|
| `open` | `boolean` | required | controlled |
| `onClose` | `() => void` | required | |
| `title` | `string` | `"Header title"` | Always pass a real title |
| `icon` | `ReactNode` | none | An icon from foundations/icons.md |
| `size` | `DrawerSize` | `"default"` | `"default"` (480px), `"small"` (300px), `"flexible"` (min 300px, default 600px, max 90vw) |
| `footer` | `ReactNode` | none | Sticky footer slot |
| `overlay` | `boolean` | `true` | |
| `closeOnOverlayClick` | `boolean` | `true` | |
| `closeOnEsc` | `boolean` | `true` | |
| `children` | `ReactNode` | none | |
| `className` | `string` | none | |
| `aria-label` / `aria-labelledby` | `string` | none | |

## Valid values

- `size`: `"default"`, `"small"`, `"flexible"`.
- Invalid or non-existent: `position`, `side`, `placement`, `size="large"`, `"medium"`, `"full"`, `modal`, `onOpenChange`, `defaultOpen`.

## Correct

```tsx
<Drawer open={open} onClose={() => setOpen(false)} title="Edit instance"
  footer={<Button onClick={() => setOpen(false)}>Save</Button>}>
  <p className="type-body-regular">Content</p>
</Drawer>
```

## Incorrect

```tsx
<Drawer position="left" size="large" />
```

Missing required `open` and `onClose`, and `position` and `size="large"` do not exist.

## Known footguns

- Visibility is fully controlled. Keep an `open` boolean in state. Set it `true` from a trigger (for example a `Button`) and `false` in `onClose`.
- `onClose` fires for the close icon, Esc and overlay click. All handled by the component.
- `footer` is a plain slot for library `Button`s. Use up to 3: typically a `link` and a `secondary` Cancel plus a `primary` CTA, right-aligned.
- The footer is pinned below the scrolling content. For long content, put actions in `footer` to keep them visible, or at the end of `children` if they should scroll.
- `children` scroll automatically when taller than the panel. Do not add your own scroll container.
- Focus is trapped inside the open drawer, the page behind is scroll-locked, and focus returns to the previous element on close. Built in.
- `icon` is a plain `ReactNode` slot. No default icon.
