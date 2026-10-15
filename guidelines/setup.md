# Setup

## Package

- `@make-kits/ads-components` is the component library for app UI in this prototype.
- It supersedes any previously published version of this design system. Do not blend in patterns from an older kit.
- Stack: React 18 + Vite.
- Peer dependencies: `react` and `react-dom` (^18.3). Never bundle or duplicate them.

## Styles

Import the stylesheet once at the app root, next to the components.

```tsx
import "@make-kits/ads-components/styles.css";
```

- The stylesheet contains the design tokens (CSS custom properties), the generated `.type-*` classes and the embedded `Nunito Sans` and `Fira Code` fonts.
- Do not add `<link>`, `@import` or `@font-face` for fonts.
- Do not add a CSS reset.
- Do not recreate colors, spacing or type styles by hand.

## Imports

- Import every component statically from `"@make-kits/ads-components"`.
- Never wrap an import from this package in a dynamic `import()`. The bundler does not support it.

```tsx
import { Button, Container } from "@make-kits/ads-components";
```

## Self-contained components

- Every component renders on its own. No app shell, routing or context provider is required.
- Do not wrap components in routing providers or app-specific context. It solves no real constraint.

## Theme

- Components have no `theme` prop. Never add one.
- Do not build a theme switch.
- Alias variables adapt to the theme on their own. Follow the token rules in foundations/colors.md exactly.
