# Guidelines

Build prototypes using ONLY the components in `@make-kits/ads-components`. Apply the rules in this file on every task.

## Import

Import components from `@make-kits/ads-components` and the stylesheet from `@make-kits/ads-components/styles.css`. Import the stylesheet once at the app root.

```tsx
import "@make-kits/ads-components/styles.css";
import { Button, Container } from "@make-kits/ads-components";
```

## Rules

1. **Use library components exactly as they are.** Do not restyle them. Do not invent variants, states, sizes or colors. Do not rebuild a library component with custom markup.
2. **Colors come from the token list.** Each component guideline has a Tokens section. Take the component's colors only from that list. Do not deviate.
3. **Build only what the prompt asks for.** No extra pages, sections, features, states or copy.
4. **Use only library components** when one exists for the job. If none fits, say so in the reply before building custom UI. Then follow the token order in rule 5.
5. **Token order for custom UI:**
   1. The tokens listed in the nearest library component's Tokens section, used as the alias or global they point to.
   2. `--alias-*` variables.
   3. `--global-color-*` variables. If you use one, say so in the reply.

   Spacing and `.type-*` classes are exempt from this order.
6. **Everything you need is in this package.** Do not look for other sources of tokens, styles or component specs. If something is missing, say so in the reply.

## Hard rules

- IMPORTANT: Never use raw hex, rgb, hsl or named colors. Not in CSS, inline styles, SVG or class names.
- IMPORTANT: Spacing uses `--global-spacing-*`. Text uses `.type-*` classes.
- IMPORTANT: Library components already carry their own tokens. Never restyle them with custom colors, `style` or `className`.
- IMPORTANT: Do not add fonts, font links or CSS resets.

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
