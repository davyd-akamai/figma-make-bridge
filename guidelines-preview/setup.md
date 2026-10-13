# Setup

## Package

- `figma-make-bridge` is the canonical source for app UI in Figma Make prototypes.
- It supersedes any previously published version of this design system. Do not blend in patterns from an older kit.
- Stack: React 18 + Vite.
- Peer dependencies: `react` and `react-dom` (^18.3). Never bundle or duplicate them.

## Install

```bash
npm install figma-make-bridge
```

## Styles

Import the stylesheet once at the app root, next to the components.

```tsx
import "figma-make-bridge/styles.css";
```

- The stylesheet contains the design tokens (CSS custom properties), the generated `.type-*` classes and the embedded `Nunito Sans` and `Fira Code` fonts.
- Do not add `<link>`, `@import` or `@font-face` for fonts.
- Do not add a CSS reset.
- Do not recreate colors, spacing or type styles by hand.

## Imports

- Import every component statically from `"figma-make-bridge"`.
- Never wrap an import from this package in a dynamic `import()`. Figma Make's bundler does not support it.

```tsx
import { Button, Container } from "figma-make-bridge";
```

## Self-contained components

- Every component renders on its own. No app shell, routing or context provider is required.
- Do not wrap components in routing providers or app-specific context. It solves no real constraint.

## Theme

- This version is light theme only.
- Components have no `theme` prop. Never add one.
- Do not build a dark mode or a theme switch.
- Components and alias variables will carry dark values in a later version. That is why the token rules in foundations/colors.md must be followed exactly.
