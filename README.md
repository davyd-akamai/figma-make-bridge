# figma-make-bridge

React components for ADS-based prototypes, shipped to Make as the kit `@make-kits/ads-components`.

## Use in Make

1. Attach the `@make-kits/ads-components` kit to the Make file.
2. Make reads the guidelines in `node_modules/@make-kits/ads-components/guidelines/`. Start with `Guidelines.md`. Nothing needs to be pasted into project instructions.

Everything Make needs is inside this package: the components, the guidelines and a Tokens list for each component.

## Start a prototype in Figma Make

Use this as the first message in a new Make project that has the ADS kit added; the setup block is required because the kit's own guidelines are empty placeholders.

```
Setup, do this first:
- Check if `figma-make-bridge` is in package.json and node_modules. If it is there, do not add, remove or change any dependency. If it is missing, install only `figma-make-bridge` as a direct dependency, change nothing else, and tell me which version you installed.
- The folder `node_modules/@make-kits/ads-components/guidelines/` contains only empty placeholders. Ignore it.
- Read `node_modules/figma-make-bridge/dist/guidelines/Guidelines.md` by exact path, then every file it links to under `node_modules/figma-make-bridge/dist/guidelines/`. Follow them exactly.
- Import all components from `figma-make-bridge` and load its stylesheet in `src/index.css`, as the guidelines say.
- Do not use any other component source or any other token source.

Rules:
- Use only library components, exactly as they are. Do not restyle them.
- Take colors from each component's Tokens section in the guidelines.
- Build only what I ask for below. Nothing extra.
- If no library component fits, tell me before you build custom UI, then follow the token order in the guidelines.
- In your reply, list which library components you used.

What to build:
[Describe the page, who uses it, the parts you need, and real labels or sample data.]
```

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

`react` and `react-dom` (^18.3.1 || ^19.0.0).
