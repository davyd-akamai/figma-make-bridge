# Make Kickoff Prompt

Reusable starting point for a fresh Make file that uses the `@make-kits/ads-components` kit. It scaffolds an initial screen with the shared shell. See [figma-make-test-guide.md](figma-make-test-guide.md) for the post-render checklist.

## Before sending the prompt below

Attach the `@make-kits/ads-components` kit to the Make file. The kit ships its guidelines (`node_modules/@make-kits/ads-components/guidelines/`) and Make reads them itself, so there is nothing to paste into the project instructions field. See [designer-instructions.md](designer-instructions.md) for the full flow.

## The prompt

```
Use the attached `@make-kits/ads-components` kit and follow its guidelines in `node_modules/@make-kits/ads-components/guidelines/`. Start with `Guidelines.md`.

Build a single starter page:
- Use `DefaultCmPageTemplate`, composing the default `GlobalHeader`, `SideNavigation` (use the exported `DEFAULT_SIDE_NAV_SECTIONS`), and `GlobalFooter`.
- Import components from `"figma-make-bridge"`. Load the stylesheet once in `index.css` with `@import 'figma-make-bridge/styles.css';`. Do not add any other font, stylesheet, or CSS reset.
- Do NOT pass `selectedPageId` to `SideNavigation` (directly or via `sideNavProps`) unless you also wire a matching `onSelectPage` that updates real state. A fixed `selectedPageId` with no handler locks navigation. For this single starter page, omit `selectedPageId`/`onSelectPage`/`pinned`/`onPinToggle` entirely and let `SideNavigation` manage its own selection and pin state.
- Fill the content slot with a few paragraphs of placeholder text, enough to make the page taller than the viewport so scroll behavior is visible.
- Build only what is described here. Use library components as they are, take colors only from the tokens the guidelines list, and do not improvise colors, fonts, or spacing.
```

## Keeping this current

The prompt points at the kit guidelines instead of repeating rules, so it does not need an edit when components or tokens change.
