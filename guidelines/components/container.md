# Container

Plain bordered content surface that groups related content inside a page's content slot.

## When to use / when not to use

- Use to group related content on a page. Stack `Container`s vertically.
- Do NOT put a `Table` inside it. `Table` owns its own bordered wrapper and needs edge-to-edge header shading, which `Container` padding would break.
- It has no header, footer or title regions. Compose those inside it.

## Import

```tsx
import { Container, type ContainerProps } from "@make-kits/ads-components";
```

## Props

| Prop | Type | Default | Allowed values |
|---|---|---|---|
| `children` | `ReactNode` | required | |
| `className` | `string` | none | Appended to the default classes |

Standard `<div>` props pass through. Built-in: component-token background and border, 24px horizontal and 16px vertical padding.

## Valid values

- No enum props.
- Invalid or non-existent: `title`, `header`, `footer`, `variant`, `elevated`, `width`, `height`, `padding`.

## Correct

```tsx
<Container>
  <h2 className="type-heading-m" style={{ margin: 0 }}>Details</h2>
  <p className="type-body-regular">Content</p>
</Container>
```

## Incorrect

```tsx
<div style={{ display: "flex" }}>
  <Container style={{ width: 400 }}>A</Container>
  <Container style={{ width: 400 }}>B</Container>
</div>
```

## Known footguns

- A `Container` always spans the full width of its parent, whatever its children's size. It never shrinks to fit.
- Never place two `Container`s side by side in a row. Never set an explicit `width` or `max-width`. Never wrap it in a flex row expecting it to sit next to another element.
- Height is intrinsic. Do not set a fixed height.
- Do not wrap a `Table` in a `Container` (see components/table.md).
