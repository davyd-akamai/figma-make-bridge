# Spacing

Read this before writing any custom spacing, padding, margin or gap.

## Rules

- Spacing comes from the global scale: `var(--global-spacing-<step>)`.
- Use only the steps below. Do not invent steps. Do not use raw `px` values for spacing.
- Spacing is exempt from the alias-first tier rule in foundations/colors.md. Use `--global-spacing-*` directly.

## Scale

| Variable | Value |
|---|---|
| `--global-spacing-s0` | 0 |
| `--global-spacing-s2` | 2px |
| `--global-spacing-s4` | 4px |
| `--global-spacing-s6` | 6px |
| `--global-spacing-s8` | 8px |
| `--global-spacing-s12` | 12px |
| `--global-spacing-s16` | 16px |
| `--global-spacing-s20` | 20px |
| `--global-spacing-s24` | 24px |
| `--global-spacing-s28` | 28px |
| `--global-spacing-s32` | 32px |
| `--global-spacing-s36` | 36px |
| `--global-spacing-s40` | 40px |
| `--global-spacing-s48` | 48px |
| `--global-spacing-s64` | 64px |
| `--global-spacing-s72` | 72px |
| `--global-spacing-s96` | 96px |

## Usage

```tsx
<div style={{ display: "flex", gap: "var(--global-spacing-s16)", marginTop: "var(--global-spacing-s24)" }}>
  <Button>Save</Button>
  <Button variant="secondary">Cancel</Button>
</div>
```

Incorrect:

```tsx
<div style={{ display: "flex", gap: 15, marginTop: "var(--global-spacing-s25)" }}>
  <Button>Save</Button>
</div>
```

`15` is a raw value, and `s25` is not a step.

## Layout rule: label with a trailing element

For a row where a trailing element (badge, chevron, icon) sits right after a label with a gap:

- Never give the label `flex-1`. It stretches to fill the row and pushes the trailing element to the far edge.
- Let the label size to its content.
- Set the gap with `gap: var(--global-spacing-s8)` on the row.

```tsx
<div style={{ display: "flex", alignItems: "center", gap: "var(--global-spacing-s8)" }}>
  <span className="type-body-regular">Metrics</span>
  <Badge label="New" />
</div>
```
