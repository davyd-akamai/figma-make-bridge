# figma-make-bridge

React components for ADS-based prototypes, shipped to Make as the kit `@make-kits/ads-components`.

## Use in Make

1. Attach the `@make-kits/ads-components` kit to the Make file.
2. Make reads the guidelines in `node_modules/@make-kits/ads-components/guidelines/`. Start with `Guidelines.md`. Nothing needs to be pasted into project instructions.

Everything Make needs is inside this package: the components, the guidelines and a Tokens list for each component.

## Imports

Components:

```tsx
import { Button, Container } from "figma-make-bridge";
```

Stylesheet, once, in `index.css`:

```css
@import 'figma-make-bridge/styles.css';
```

The stylesheet contains the design tokens, the `.type-*` text classes and the embedded fonts. Do not add other fonts or a CSS reset.

## What is inside

- `guidelines/Guidelines.md`: the rules Make follows on every task.
- `guidelines/setup.md`: imports, styles and theme.
- `guidelines/components/`: one file per component, with props, usage rules and a Tokens section.
- `guidelines/foundations/`: colors, spacing, typography and icons.
- `guidelines/composition/`: the page shell and composed examples.

## Rules in short

- Use library components exactly as they are. Do not restyle them or invent variants, states, sizes or colors.
- Take each component's colors only from its Tokens section.
- Build only what the prompt asks for.
- If no library component fits, say so before building custom UI. Colors for custom UI come from the nearest component's tokens, then `--alias-*`, then `--global-color-*`.

## Peer dependencies

`react` and `react-dom` (^18.3).
