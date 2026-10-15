# Figma Make Kickoff Prompt

Reusable starting point for a fresh Figma Make file: connects `figma-make-bridge` and scaffolds an initial screen with it. See [figma-make-test-guide.md](figma-make-test-guide.md) for background and the post-render verification checklist.

## Before sending the prompt below

Paste the current contents of [guidelines/Guidelines.md](guidelines/Guidelines.md) into Figma Make's own Guidelines/project-instructions field — do this first, so its AI already has our component, token, and typography rules in context before it generates anything.

## The prompt

```
Add the npm package `figma-make-bridge` latest published version as a dependency.

Then build a single starter page:
- Use `DefaultCmPageTemplate`, composing the default `GlobalHeader`, `SideNavigation` (use the exported `DEFAULT_SIDE_NAV_SECTIONS`), and `GlobalFooter`.
- Import `figma-make-bridge/styles.css` once at the app root — do not add any other font, stylesheet, or CSS reset.
- Do NOT pass `selectedPageId` to `SideNavigation` (directly or via `sideNavProps`) unless you also wire a matching `onSelectPage` that updates real state — passing a fixed/hardcoded `selectedPageId` with no handler locks navigation so clicking a different page does nothing. For this single starter page, omit `selectedPageId`/`onSelectPage`/`pinned`/`onPinToggle` entirely and let `SideNavigation` manage its own selection and pin state.
- Fill the content slot with a few paragraphs of placeholder text, enough to make the page taller than the viewport so scroll behavior is visible.
- Follow `Guidelines.md` from the package for everything else (typography classes, token usage, component props) — do not improvise colors, fonts, or spacing.
```

## Keeping this current

The prompt deliberately says "latest published version" instead of a version number, so it never needs a bump when a new version is published (see [GUIDELINES.md](GUIDELINES.md)'s "Packaging" section for what's actually live).
