# Guidelines

Build prototypes using ONLY the components in this kit (`@make-kits/ads-components`). Apply the rules in this file on every task.

## Import

Import components from `figma-make-bridge`. Load the stylesheet once in `index.css`.

```css
@import 'figma-make-bridge/styles.css';
```

```tsx
import { Button, Container } from "figma-make-bridge";
```

## Styling rules

- Use library components exactly as they are. Do not add `className`, `style` props or CSS that changes their look (colors, borders, radius, fonts). Layout wrappers (spacing, grid, flex) around a component are fine. Do not add borders, backgrounds, margins or styles to the component itself, and never wrap Pagination. Take colors only from the component's Tokens section.
- All corners are square. Use no border radius on any element, including tables, cards, inputs, panels and custom UI. Do not add `rounded-*` classes or `border-radius` styles. Exceptions: shapes that are round by definition (radio buttons, switch tracks and knobs, avatars, notification dots). Add any other radius only if the prompt explicitly asks for it for that element.
- Build only what the prompt asks for.

## Global rules

- Links have no underline in any state: rest, hover, focus or visited. Do not add `underline`, `hover:underline` or `text-decoration`.
- Every clickable or interactive element shows a pointer cursor. Disabled ones show `not-allowed`. Library components do this already. Custom UI must do it too.

## Converting an existing design

- Keep the layout, content and structure of the existing design.
- Replace every custom element with the matching library component.
- Do not carry over custom styles from the original: underlines, borders, wrapper containers, margins around library components, colors, cursors, font settings.
- Use library components exactly as they are. Do not add `className` or `style` to change how they look.

## Custom UI

- Links have no underline in any state.
- Interactive elements use `cursor-pointer`. Disabled ones use `cursor-not-allowed`.
- Colors and spacing follow the token order in rule 3 below.

## Rules

1. **Do not invent variants, states, sizes or colors.** Do not rebuild a library component with custom markup.
2. **Use only library components** when one exists for the job. If none fits, say so in the reply before building custom UI. Then follow the token order in rule 3.
3. **Token order for custom UI:**
   1. The tokens listed in the nearest library component's Tokens section, used as the alias or global they point to.
   2. `--alias-*` variables.
   3. `--global-color-*` variables. If you use one, say so in the reply.

   Spacing and `.type-*` classes are exempt from this order.
4. **Everything you need is in this package.** Do not look for other sources of tokens, styles or component specs. If something is missing, say so in the reply.

## Hard rules

- IMPORTANT: Never use raw hex, rgb, hsl or named colors. Not in CSS, inline styles, SVG or class names.
- IMPORTANT: Spacing uses `--global-spacing-*`. Text uses `.type-*` classes.
- IMPORTANT: Library components already carry their own tokens. Never restyle them with custom colors, `style` or `className`.
- IMPORTANT: Do not add fonts, font links or CSS resets.
- IMPORTANT: Page titles, headings and body text inherit the page template's text color. Do not add color classes or hard-coded colors to them. The page background comes from the template. Custom text colors use `--alias-content-text-*`, custom backgrounds use `--alias-background-*`, then `--global-color-*`. No Tailwind color utilities (`text-black`, `bg-white`, `bg-gray-*`, `bg-slate-*`).

## Before finishing

Scan your code for hard-coded colors (hex, rgb, Tailwind color classes, non-ADS variables). Replace them with ADS variables, or report them in the reply.

## Page structure

Page templates (product landing page, resource details page) are in composition/page-shell.md.

When a page is a detail page below a product landing page, read `components/breadcrumbs.md` and use the breadcrumb as the page header, not a page title.

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

If a needed variant, prop, state or component does not exist, say so in the reply before building custom UI. Do not fake it.
