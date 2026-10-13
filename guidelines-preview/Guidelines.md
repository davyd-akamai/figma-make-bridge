# Guidelines

Build prototypes using ONLY the components in `figma-make-bridge`. Apply the rules in this file on every task. They do not depend on any other file being read.

## Components first

Work down this list in order. Stop at the first step that works.

1. **Use a library component**, configured only through its documented props.
2. **Compose from library components plus layout** (flex/grid, global spacing).
3. **Custom element: last resort.** State it in the reply: what you built and why no library component fit.

## IMPORTANT: hard rules

- IMPORTANT: Never use raw hex, rgb, hsl or named colors. Not in CSS, inline styles, SVG or class names.
- IMPORTANT: Custom UI colors use `--alias-*` variables only. `--global-color-*` is a rare last resort. If you use one, mention it in the reply (which variable, why no alias fit).
- IMPORTANT: Spacing uses `--global-spacing-*`. Text uses `.type-*` classes.
- IMPORTANT: Library components already carry their own tokens. Never restyle them with custom colors, `style` or `className`.
- IMPORTANT: Import `figma-make-bridge/styles.css` once. Do not add fonts, font links or CSS resets.

## READ BEFORE USE

Read the file in full before you write the code it covers. Do not guess props, variants, token names or icon names.

| Situation | Read first |
|---|---|
| Starting a project, imports, styles, theme | setup.md |
| Before using ANY component | components/overview.md, then the file for that component |
| Before writing any custom color | foundations/colors.md |
| Before writing any custom spacing or gap | foundations/spacing.md |
| Before writing any text | foundations/typography.md |
| Before using any icon | foundations/icons.md |
| Before building a page layout | composition/page-shell.md |
| Before composing a page, form, table or drawer | composition/examples.md |

Component files use kebab-case names. Examples:

- `Button` -> components/button.md
- `TextField` -> components/text-field.md
- `TabsHorizontal` -> components/tabs-horizontal.md
- `DefaultCmPageTemplate` -> composition/page-shell.md

If a needed variant, prop, state or component does not exist, that is a step 3 situation. Say so in the reply. Do not fake it.
