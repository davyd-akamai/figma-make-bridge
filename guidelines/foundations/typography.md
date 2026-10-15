# Typography

Read this before writing any text.

## Rules

- Every piece of text renders in the brand typeface `Nunito Sans`. Code and monospace text only use `Fira Code`.
- Never set a different `font-family`. Never fall back to a host environment's default font.
- Never add your own `<link>` or `@import` for a font. Both typefaces are embedded in `figma-make-bridge/styles.css`. Importing it once is enough (see setup.md).
- Hierarchy comes only from the generated `.type-*` classes below. One class per text style. Each fixes `font-family`, `font-weight`, `font-size` and `line-height` together.
- Apply the matching class to every text element.
- Never hand-set `font-size`, `font-weight` or `line-height`. Never mix a `.type-*` class with a manual override of any of those four.
- Pick a class by the text's role in the layout, not by how large you want it to look.
- Text is exempt from the token order. Use the `.type-*` classes directly. Text color still follows foundations/colors.md.

## Classes

| Class | Weight | Size | Line height | Use for |
|---|---|---|---|---|
| `type-heading-xxxl` | Bold | 2.25rem | 2.625rem | Page-level hero heading (rare) |
| `type-heading-xxl` | Extrabold | 1.625rem | 2rem | Top-level page title |
| `type-heading-xl` | Bold | 1.5rem | 1.875rem | Major section heading |
| `type-heading-l` | Bold | 1.25rem | 1.625rem | Subsection heading |
| `type-heading-m` | Bold | 1.125rem | 1.5rem | Card, panel or group title |
| `type-heading-s` | Bold | 1rem | 1.25rem | Minor heading, compact contexts |
| `type-heading-xs` | Bold | 0.875rem | 1.125rem | Smallest heading, table/list group headers |
| `type-heading-overline` | Extrabold | 0.75rem | 1rem | Small eyebrow label above a heading |
| `type-body-regular` | Regular | 0.875rem | 1.25rem | Default paragraph and body copy |
| `type-body-semibold` | Semibold | 0.875rem | 1.25rem | Emphasized inline body text |
| `type-body-bold` | Bold | 0.875rem | 1.25rem | Strongly emphasized inline body text |
| `type-body-extrabold` | Extrabold | 0.875rem | 1.25rem | Rare, heaviest inline emphasis |
| `type-body-italic` | Regular italic | 0.875rem | 1.25rem | Asides, captions, quoted text |
| `type-body-list` | Regular | 0.875rem | 1.25rem | List item text |
| `type-label-bold-l` | Bold | 1rem | 1.25rem | Form labels, table headers, emphasized UI labels (large) |
| `type-label-bold-s` | Bold | 0.875rem | 1rem | Form labels, table headers, emphasized UI labels (small) |
| `type-label-bold-xs` | Bold | 0.75rem | 0.875rem | Form labels, table headers, emphasized UI labels (extra small) |
| `type-label-semibold-l` | Semibold | 1rem | 1.25rem | Standard UI labels: buttons, nav items, chips (large) |
| `type-label-semibold-s` | Semibold | 0.875rem | 1rem | Standard UI labels: buttons, nav items, chips (small) |
| `type-label-semibold-xs` | Semibold | 0.75rem | 1rem | Standard UI labels: buttons, nav items, chips (extra small) |
| `type-label-regular-s` | Regular | 0.875rem | 1rem | Secondary UI labels (small) |
| `type-label-regular-xs` | Regular | 0.75rem | 1rem | Secondary UI labels (extra small) |
| `type-label-regular-placeholder` | Regular italic | 0.875rem | 1rem | Input placeholder text only |
| `type-code` | Regular, `Fira Code` | 0.813rem | 1.25rem | Inline code and monospace snippets only |

`type-heading-overline` does not transform case. Write the label text in uppercase yourself if the design needs it.

## Missing styles

If a screen needs text styling this table does not cover, flag it as a gap. Do not invent a one-off `font-size` or `font-weight`.

## Examples

Correct:

```tsx
<h1 className="type-heading-xxl" style={{ margin: 0 }}>Instances</h1>
<p className="type-body-regular" style={{ margin: 0 }}>Manage your compute instances.</p>
```

Incorrect:

```tsx
<h1 className="type-heading-xxl" style={{ fontSize: 40, fontFamily: "Inter" }}>Instances</h1>
<p style={{ fontSize: "14px", fontWeight: 500 }}>Manage your compute instances.</p>
```
